<?php

use App\Enums\Fraud\FraudReviewLabel;
use App\Enums\Order\OrderStatus;
use App\Models\Fraud\FraudAssessment;
use App\Models\Fraud\FraudAssessmentHistory;
use App\Models\Order\Order;
use App\Models\Order\OrderAttempt;
use App\Models\Catalog\Product;
use App\Models\Auth\Role;
use App\Models\Users\User;
use App\Models\Delivery\Wilaya;
use App\Services\Fraud\FraudAssessmentService;
use App\Services\Fraud\FraudReviewService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    Notification::fake();
    $this->fraudSeq = 0;
    $this->fraudProduct = Product::create([
        'name' => 'Test product',
        'description' => 'Test product description',
        'price' => 1000,
        'stock' => 10,
        'image_1' => 'test.jpg',
    ]);
    $this->fraudWilaya = Wilaya::create(['name' => 'Test Wilaya', 'code' => 999]);
});

afterEach(function () {
    Carbon::setTestNow();
});

/**
 * Places a storefront order. Unless overridden, every identifier is unique so
 * each test only shares the identifiers it cares about.
 *
 * @param  array<string, mixed>  $o  keys: fp, phone, ip, commune, ua
 */
function fraudOrder($test, array $o = []): Order
{
    $n = ++$test->fraudSeq;
    $fp = array_key_exists('fp', $o) ? $o['fp'] : "fp-{$n}";
    $payload = [
        'first_name' => 'Test',
        'last_name' => 'Customer',
        'phone_number' => $o['phone'] ?? sprintf('055500%04d', $n),
        'wilaya_id' => $test->fraudWilaya->id,
        'provider_commune_id' => $o['commune'] ?? 1000 + $n,
        'items' => [['product_id' => $test->fraudProduct->id, 'quantity' => 1]],
    ];
    if ($fp !== null) {
        $payload['fingerprint'] = $fp;
    }

    $response = $test
        ->withServerVariables(['REMOTE_ADDR' => $o['ip'] ?? '203.0.113.'.$n])
        ->withHeaders(['User-Agent' => $o['ua'] ?? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'])
        ->postJson('/api/v1/orders', $payload);

    $response->assertCreated();

    return Order::findOrFail($response->json('id'));
}

function fraudAssessment(Order $order): FraudAssessment
{
    return FraudAssessment::where('order_id', $order->id)->firstOrFail();
}

function fraudReviewer(): User
{
    $role = Role::forceCreate(['name' => 'Admin', 'slug' => 'admin', 'permissions' => [], 'is_system' => true]);

    return User::factory()->create(['role_id' => $role->id]);
}

function fraudHasRule(FraudAssessment $a, string $rule): bool
{
    return collect($a->reasons)->contains('rule', $rule);
}

test('first order from a fingerprint adds zero daily points', function () {
    $order = fraudOrder($this, ['fp' => 'same']);

    $a = fraudAssessment($order);
    expect($a->daily_points)->toBe(0)->and($a->score)->toBe(0)->and($a->counts['fingerprint'])->toBe(1);
});

test('fingerprint daily points grow by 5 per additional order', function (int $orders, int $expected) {
    for ($i = 0; $i < $orders; $i++) {
        $last = fraudOrder($this, ['fp' => 'same']);
    }

    expect(fraudAssessment($last)->daily_points)->toBe($expected);
})->with([[2, 5], [3, 10], [4, 15], [5, 20]]);

test('daily points reset at the Algiers midnight', function () {
    Carbon::setTestNow('2026-10-12 22:10:00'); // 23:10 in Algiers
    fraudOrder($this, ['fp' => 'same']);
    $second = fraudOrder($this, ['fp' => 'same']);
    expect(fraudAssessment($second)->daily_points)->toBe(5);

    Carbon::setTestNow('2026-10-12 23:30:00'); // 00:30 next day in Algiers, same UTC date
    $next = fraudOrder($this, ['fp' => 'same']);
    expect(fraudAssessment($next)->daily_points)->toBe(0)
        ->and(fraudAssessment($next)->counts['fingerprint'])->toBe(1)
        // yesterday's orders keep their own day's score
        ->and(fraudAssessment($second)->daily_points)->toBe(5);
});

test('orders on separate days never add daily points', function () {
    foreach (['2026-10-10', '2026-10-11', '2026-10-12'] as $day) {
        Carbon::setTestNow("$day 12:00:00");
        $order = fraudOrder($this, ['fp' => 'same']);
        expect(fraudAssessment($order)->daily_points)->toBe(0);
    }
});

test('confirmed fake history persists on later days and survives IP and phone changes', function () {
    Carbon::setTestNow('2026-10-10 12:00:00');
    $fake = fraudOrder($this, ['fp' => 'bad']);
    app(FraudReviewService::class)->setLabel($fake, FraudReviewLabel::ConfirmedFake, 'Called, never ordered', fraudReviewer());

    Carbon::setTestNow('2026-10-14 12:00:00');
    // new IP, new phone, new address — only the fingerprint matches
    $later = fraudOrder($this, ['fp' => 'bad']);

    $a = fraudAssessment($later);
    expect($a->historical_points)->toBe(40)
        ->and($a->daily_points)->toBe(0)
        ->and($a->score)->toBe(40)
        ->and(fraudHasRule($a, 'historical.fingerprint'))->toBeTrue()
        ->and(fraudHasRule($a, 'historical.ip'))->toBeFalse()
        ->and(fraudHasRule($a, 'historical.phone'))->toBeFalse();
});

test('a phone change does not erase fingerprint history and an IP change does not erase phone history', function () {
    $fake = fraudOrder($this, ['fp' => 'bad', 'phone' => '0555111111', 'ip' => '198.51.100.1']);
    app(FraudReviewService::class)->setLabel($fake, FraudReviewLabel::ConfirmedFake, 'Fake', fraudReviewer());

    $samePhoneNewIpFp = fraudOrder($this, ['phone' => '+213555111111', 'ip' => '198.51.100.2']);
    $a = fraudAssessment($samePhoneNewIpFp);
    expect($a->historical_points)->toBe(35)->and(fraudHasRule($a, 'historical.phone'))->toBeTrue();

    $sameFpNewPhone = fraudOrder($this, ['fp' => 'bad', 'phone' => '0666222222']);
    expect(fraudAssessment($sameFpNewPhone)->historical_points)->toBe(40);
});

test('a missing fingerprint still allows assessment from remaining signals', function () {
    fraudOrder($this, ['fp' => null, 'phone' => '0555333333']);
    $second = fraudOrder($this, ['fp' => null, 'phone' => '0555333333']);

    $a = fraudAssessment($second);
    expect($a->counts['fingerprint'])->toBeNull()
        ->and($a->counts['phone'])->toBe(2)
        ->and($a->daily_points)->toBe(3);
});

test('cancelled and delivered orders never create confirmed-fraud points', function (OrderStatus $status) {
    $previous = fraudOrder($this, ['fp' => 'same', 'phone' => '0555444444']);
    $previous->update(['status' => $status]);

    $new = fraudOrder($this, ['fp' => 'same', 'phone' => '0555444444']);

    $a = fraudAssessment($new);
    expect($a->historical_points)->toBe(0)->and($a->outcome_points)->toBe(0);
})->with([OrderStatus::Cancelled, OrderStatus::Delivered, OrderStatus::FakeOrder]);

test('a shared IP only adds one point per extra order', function () {
    fraudOrder($this, ['ip' => '198.51.100.9']);
    $second = fraudOrder($this, ['ip' => '198.51.100.9']);

    $a = fraudAssessment($second);
    expect($a->daily_points)->toBe(1)->and($a->score)->toBe(1);
});

test('browser, OS and device are parsed from the server side User-Agent', function () {
    fraudOrder($this, ['ua' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1']);

    $attempt = OrderAttempt::latest('id')->first();
    expect($attempt->os_name)->toBe('iOS')
        ->and($attempt->device_category)->toBe('smartphone')
        ->and($attempt->browser_name)->toContain('Safari');
});

test('raw identifiers are stored only as keyed hashes for matching', function () {
    fraudOrder($this, ['fp' => 'secret-fp', 'phone' => '0555999999']);

    $attempt = OrderAttempt::latest('id')->first();
    expect($attempt->fingerprint_key)->toHaveLength(64)->not->toContain('secret-fp')
        ->and($attempt->phone_key)->toHaveLength(64)->not->toContain('0555999999');
});

test('validation failures are recorded but never counted as orders', function () {
    $this->postJson('/api/v1/orders', ['fingerprint' => 'same', 'phone_number' => '0555000001'])->assertUnprocessable();

    expect(OrderAttempt::where('status', 'validation_failed')->count())->toBe(1);

    $order = fraudOrder($this, ['fp' => 'same']);
    expect(fraudAssessment($order)->counts['fingerprint'])->toBe(1);
});

test('re-running an assessment does not duplicate records or points', function () {
    fraudOrder($this, ['fp' => 'same']);
    $second = fraudOrder($this, ['fp' => 'same']);
    $service = app(FraudAssessmentService::class);

    $service->assessOrder($second->id, 'order_created');
    $service->assessOrder($second->id, 'order_created');

    expect(FraudAssessment::where('order_id', $second->id)->count())->toBe(1)
        ->and(fraudAssessment($second)->daily_points)->toBe(5)
        ->and(FraudAssessmentHistory::where('fraud_assessment_id', fraudAssessment($second)->id)->count())->toBe(1);

    expect(fn () => FraudAssessment::create([
        'order_id' => $second->id, 'score' => 0, 'risk_level' => 'LOW', 'recommended_action' => 'none',
        'counts' => [], 'historical' => [], 'reasons' => [], 'rules_version' => '1', 'assessed_at' => now(),
    ]))->toThrow(Illuminate\Database\UniqueConstraintViolationException::class);
});

test('earlier same-day related orders are rescored when a new order arrives', function () {
    $first = fraudOrder($this, ['fp' => 'same']);
    expect(fraudAssessment($first)->score)->toBe(0);

    $unrelated = fraudOrder($this);
    fraudOrder($this, ['fp' => 'same']);

    expect(fraudAssessment($first)->score)->toBe(5)
        ->and(FraudAssessmentHistory::where('fraud_assessment_id', fraudAssessment($first)->id)->count())->toBe(2)
        ->and(FraudAssessmentHistory::where('fraud_assessment_id', fraudAssessment($unrelated)->id)->count())->toBe(1);
});

test('stale assessments converge after a recalculation (concurrent submission strategy)', function () {
    $orders = [fraudOrder($this, ['fp' => 'same']), fraudOrder($this, ['fp' => 'same']), fraudOrder($this, ['fp' => 'same'])];
    FraudAssessment::query()->update(['score' => 0, 'daily_points' => 0]);

    $last = OrderAttempt::where('order_id', end($orders)->id)->first();
    app(FraudAssessmentService::class)->assessOrder(end($orders)->id, 'order_created');
    app(FraudAssessmentService::class)->recalculateRelatedSameDay($last);

    foreach ($orders as $order) {
        expect(fraudAssessment($order)->daily_points)->toBe(10);
    }
});

test('changing a review label updates later orders historical score', function () {
    $earlier = fraudOrder($this, ['fp' => 'same']);
    $later = fraudOrder($this, ['fp' => 'same']);
    expect(fraudAssessment($later)->historical_points)->toBe(0);

    $reviews = app(FraudReviewService::class);
    $reviewer = fraudReviewer();

    $reviews->setLabel($earlier, FraudReviewLabel::ConfirmedFake, 'Confirmed by call', $reviewer);
    expect(fraudAssessment($later)->historical_points)->toBe(40)
        ->and(fraudAssessment($later)->score)->toBe(45);

    $reviews->setLabel($earlier, FraudReviewLabel::Legitimate, 'Customer confirmed', $reviewer);
    expect(fraudAssessment($later)->historical_points)->toBe(0)->and(fraudAssessment($later)->score)->toBe(5);

    expect($earlier->fresh()->status)->toBe(OrderStatus::New); // status never touched by review
});

test('a failing fraud assessment never blocks order creation', function () {
    $this->mock(FraudAssessmentService::class)
        ->shouldReceive('assessOrder')->andThrow(new RuntimeException('boom with 0555123456'));

    $order = fraudOrder($this);

    expect(Order::find($order->id))->not->toBeNull()
        ->and(FraudAssessment::count())->toBe(0);
});
