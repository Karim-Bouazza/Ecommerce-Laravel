<?php

use App\Data\Fraud\HistoricalMatch;
use App\Data\Fraud\OutcomeSignal;
use App\Enums\Fraud\FraudRiskLevel;
use App\Services\Fraud\FraudScoringService;
use App\Services\Fraud\IdentifierNormalizer;
use App\Services\Fraud\MatchingKeyHasher;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function fraudNoHistory(): array
{
    return ['fingerprint' => null, 'phone' => null, 'ip' => null, 'address' => null];
}

test('daily contribution is capped at 40 and historical at 60', function () {
    $r = app(FraudScoringService::class)->score(
        ['fingerprint' => 10, 'phone' => 10, 'ip' => 10, 'address' => 10],
        fraudNoHistory(),
        new OutcomeSignal(false, 0, []),
    );
    expect($r->dailyPoints)->toBe(40)->and($r->score)->toBe(40);

    $m = new HistoricalMatch(1, [1]);
    $r = app(FraudScoringService::class)->score(
        ['fingerprint' => 1, 'phone' => 1, 'ip' => 1, 'address' => 1],
        ['fingerprint' => $m, 'phone' => $m, 'ip' => $m, 'address' => $m],
        new OutcomeSignal(false, 0, []),
    );
    expect($r->historicalPoints)->toBe(60)->and($r->riskLevel)->toBe(FraudRiskLevel::High);
});

test('final score is capped at 100 and combines D + H + O', function () {
    config(['fraud.outcome.enabled' => true]);
    $m = new HistoricalMatch(1, [1]);

    $r = app(FraudScoringService::class)->score(
        ['fingerprint' => 10, 'phone' => 1, 'ip' => 1, 'address' => 1],
        ['fingerprint' => $m, 'phone' => $m, 'ip' => $m, 'address' => $m],
        new OutcomeSignal(true, 5, ['returned']),
    );

    expect($r->outcomePoints)->toBe(10)->and($r->score)->toBe(100)
        ->and($r->riskLevel)->toBe(FraudRiskLevel::Critical)
        ->and($r->reasons)->not->toBeEmpty()
        ->and($r->rulesVersion)->toBe(config('fraud.rules_version'));
});

test('risk level thresholds', function (int $score, FraudRiskLevel $level) {
    expect(FraudRiskLevel::fromScore($score))->toBe($level);
})->with([
    [0, FraudRiskLevel::Low], [24, FraudRiskLevel::Low],
    [25, FraudRiskLevel::Medium], [49, FraudRiskLevel::Medium],
    [50, FraudRiskLevel::High], [74, FraudRiskLevel::High],
    [75, FraudRiskLevel::Critical], [100, FraudRiskLevel::Critical],
]);

test('phone numbers are normalised and hashed stably', function () {
    $n = new IdentifierNormalizer;
    $h = new MatchingKeyHasher;

    expect($n->phone('+213 555-12-34-56'))->toBe('0555123456')
        ->and($n->phone('00213555123456'))->toBe('0555123456')
        ->and($n->phone('0555 12 34 56'))->toBe('0555123456')
        ->and($h->make('phone', '0555123456'))->toBe($h->make('phone', '0555123456'))
        ->and($h->make('phone', '0555123456'))->not->toBe($h->make('ip', '0555123456'))
        ->and($h->make('phone', null))->toBeNull();
});

test('the hmac key is mandatory in production', function () {
    config(['fraud.hmac_key' => null]);
    app()->detectEnvironment(fn () => 'production');

    expect(fn () => (new MatchingKeyHasher)->make('phone', '0555'))->toThrow(RuntimeException::class);
});

test('excluded IP points grow with the precision of the matching entry', function (string $pattern, string $ip, int $points) {
    \App\Models\Marketing\PixelExcludedIp::create(['pattern' => $pattern]);

    $attempt = new \App\Models\Order\OrderAttempt(['ip_address' => $ip]);
    $match = app(\App\Services\Fraud\ExcludedIpCalculator::class)->match($attempt);

    expect($match->points)->toBe($points);

    $r = app(FraudScoringService::class)->score(
        ['fingerprint' => null, 'phone' => null, 'ip' => null, 'address' => null],
        fraudNoHistory(),
        new OutcomeSignal(false, 0, []),
        $match,
    );

    expect($r->excludedIpPoints)->toBe($points)->and($r->score)->toBe($points);
})->with([
    'exact IP' => ['123.50.82.34', '123.50.82.34', 20],
    '/24 wildcard' => ['123.50.82.*', '123.50.82.34', 12],
    '/16 wildcard' => ['123.50.*.*', '123.50.82.34', 6],
    '/8 wildcard' => ['123.*.*.*', '123.50.82.34', 2],
]);

test('the most specific excluded entry wins and no entry means no points', function () {
    \App\Models\Marketing\PixelExcludedIp::create(['pattern' => '123.50.*.*']);
    \App\Models\Marketing\PixelExcludedIp::create(['pattern' => '123.50.82.34']);

    $calculator = app(\App\Services\Fraud\ExcludedIpCalculator::class);

    expect($calculator->match(new \App\Models\Order\OrderAttempt(['ip_address' => '123.50.82.34']))->points)->toBe(20)
        ->and($calculator->match(new \App\Models\Order\OrderAttempt(['ip_address' => '123.50.9.9']))->points)->toBe(6)
        ->and($calculator->match(new \App\Models\Order\OrderAttempt(['ip_address' => '8.8.8.8'])))->toBeNull()
        ->and($calculator->match(new \App\Models\Order\OrderAttempt(['ip_address' => null])))->toBeNull();
});
