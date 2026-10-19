<?php

use App\Models\Order\Order;
use App\Models\Marketing\PixelExcludedIp;
use App\Models\Catalog\Product;
use App\Models\Auth\Role;
use App\Models\Users\User;
use App\Models\Delivery\Wilaya;
use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function pixelIpUser(array $permissions): User
{
    $role = Role::forceCreate([
        'name' => 'R'.uniqid(), 'slug' => 'r'.uniqid(), 'permissions' => $permissions, 'is_system' => false,
    ]);

    return User::factory()->create(['role_id' => $role->id]);
}

function pixelIpOrderFrom($test, string $ip)
{
    Notification::fake();
    $product = Product::create(['name' => 'P', 'description' => 'd', 'price' => 1000, 'stock' => 5, 'image_1' => 'a.jpg']);
    $wilaya = Wilaya::create(['name' => 'W'.uniqid(), 'code' => random_int(100, 9999)]);

    return $test->withServerVariables(['REMOTE_ADDR' => $ip])->postJson('/api/v1/orders', [
        'first_name' => 'A', 'last_name' => 'B', 'phone_number' => '0555123456',
        'wilaya_id' => $wilaya->id,
        'items' => [['product_id' => $product->id, 'quantity' => 1]],
    ]);
}

test('matcher supports exact, wildcard and CIDR patterns', function (string $pattern, string $ip, bool $expected) {
    PixelExcludedIp::create(['pattern' => $pattern]);

    expect(app(ExcludedIpMatcher::class)->matches($ip))->toBe($expected);
})->with([
    ['203.0.113.10', '203.0.113.10', true],
    ['203.0.113.10', '203.0.113.11', false],
    ['123.32.58.*', '123.32.58.7', true],
    ['123.32.58.*', '123.32.59.7', false],
    ['123.32.*.*', '123.32.200.1', true],
    ['123.32.58.0/24', '123.32.58.255', true],
    ['123.32.58.0/24', '123.32.57.255', false],
    ['2001:db8::/32', '2001:db8::1', true],
    ['2001:db8::/32', '2001:db9::1', false],
]);

test('matcher ignores missing or invalid IPs and an empty list', function () {
    expect(app(ExcludedIpMatcher::class)->matches(null))->toBeFalse()
        ->and(app(ExcludedIpMatcher::class)->matches('not-an-ip'))->toBeFalse()
        ->and(app(ExcludedIpMatcher::class)->matches('8.8.8.8'))->toBeFalse();
});

test('an order from an excluded wildcard is created but purchase is not tracked', function () {
    PixelExcludedIp::create(['pattern' => '123.32.58.*']);

    pixelIpOrderFrom($this, '123.32.58.40')
        ->assertCreated()
        ->assertJsonPath('track_purchase', false);

    pixelIpOrderFrom($this, '123.32.99.40')
        ->assertCreated()
        ->assertJsonPath('track_purchase', true);

    expect(Order::count())->toBe(2);
});

test('only the first order per IP in 24h is tracked as a purchase', function () {
    pixelIpOrderFrom($this, '123.13.53.183')->assertJsonPath('track_purchase', true);
    pixelIpOrderFrom($this, '123.13.53.183')->assertJsonPath('track_purchase', false);
    pixelIpOrderFrom($this, '123.13.53.184')->assertJsonPath('track_purchase', true);

    $this->travel(25)->hours();

    pixelIpOrderFrom($this, '123.13.53.183')->assertJsonPath('track_purchase', true);
});

test('the default range is seeded and removing an entry takes effect immediately', function () {
    pixelIpOrderFrom($this, '105.235.133.9')->assertJsonPath('track_purchase', false);

    PixelExcludedIp::where('pattern', '105.235.133.*')->first()->delete();

    pixelIpOrderFrom($this, '105.235.133.9')->assertJsonPath('track_purchase', true);
});

test('staff can add and remove excluded IPs with the right permissions', function () {
    $this->actingAs(pixelIpUser(['pixels.view']), 'sanctum')
        ->postJson('/api/v1/pixel-excluded-ips', ['pattern' => '10.0.0.*'])
        ->assertForbidden();

    $admin = pixelIpUser(['pixels.view', 'pixels.create', 'pixels.delete']);

    $id = $this->actingAs($admin, 'sanctum')
        ->postJson('/api/v1/pixel-excluded-ips', ['pattern' => ' 10.0.0.* ', 'note' => ' Bureau '])
        ->assertCreated()
        ->assertJsonPath('pattern', '10.0.0.*')
        ->assertJsonPath('type', 'wildcard')
        ->assertJsonPath('note', 'Bureau')
        ->json('id');

    $this->getJson('/api/v1/pixel-excluded-ips')->assertOk()->assertJsonFragment(['pattern' => '10.0.0.*']);

    $this->deleteJson("/api/v1/pixel-excluded-ips/{$id}")->assertOk();
    expect(PixelExcludedIp::find($id))->toBeNull();
});

test('invalid, overly broad and duplicate patterns are rejected', function (string $pattern) {
    $admin = pixelIpUser(['pixels.view', 'pixels.create']);
    PixelExcludedIp::create(['pattern' => '10.0.0.*']);

    $this->actingAs($admin, 'sanctum')
        ->postJson('/api/v1/pixel-excluded-ips', ['pattern' => $pattern])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('pattern');
})->with([
    'garbage' => 'abc',
    'everything' => '*.*.*.*',
    'zero prefix' => '0.0.0.0/0',
    'bad octet' => '300.1.1.*',
    'range' => '10.0.0.1-10.0.0.9',
    'duplicate as cidr' => '10.0.0.0/24',
]);
