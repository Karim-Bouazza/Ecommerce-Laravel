<?php

namespace App\Services\Fraud;

use App\Data\Fraud\ExcludedIpMatch;
use App\Data\Fraud\FraudScore;
use App\Data\Fraud\HistoricalMatch;
use App\Data\Fraud\OutcomeSignal;
use App\Enums\Fraud\FraudRiskLevel;

/**
 * Pure scoring: turns collected signals into a score and explanation.
 * Knows nothing about order acceptance, requests or persistence.
 */
class FraudScoringService
{
    private const LABELS = [
        'fingerprint' => 'browser fingerprint',
        'phone' => 'phone number',
        'ip' => 'IP address',
        'address' => 'delivery address',
    ];

    /**
     * @param  array<string, int|null>  $dailyCounts  orders today per identifier (null = identifier missing)
     * @param  array<string, HistoricalMatch|null>  $historical  confirmed-fake matches (null = identifier missing)
     * @param  ExcludedIpMatch|null  $excludedIp  most specific excluded-IP entry matching the order IP
     */
    public function score(array $dailyCounts, array $historical, OutcomeSignal $outcome, ?ExcludedIpMatch $excludedIp = null): FraudScore
    {
        $reasons = [];

        $daily = 0;
        foreach (config('fraud.daily.weights') as $type => $weight) {
            $count = $dailyCounts[$type] ?? null;
            if ($count === null) {
                continue;
            }

            $points = max(0, $count - 1) * $weight;
            if ($points > 0) {
                $daily += $points;
                $reasons[] = [
                    'rule' => "daily.{$type}",
                    'component' => 'daily',
                    'identifier' => $type,
                    'points' => $points,
                    'evidence' => ['orders_today' => $count, 'points_per_additional_order' => $weight],
                    'explanation' => "{$count} orders today share the same ".self::LABELS[$type]." (+{$points}).",
                ];
            }
        }
        $dailyCapped = min($daily, (int) config('fraud.daily.cap'));

        $hist = 0;
        foreach (config('fraud.historical.weights') as $type => $weight) {
            $match = $historical[$type] ?? null;
            if ($match === null || $match->orders < 1) {
                continue;
            }

            $hist += $weight;
            $reasons[] = [
                'rule' => "historical.{$type}",
                'component' => 'historical',
                'identifier' => $type,
                'points' => $weight,
                'evidence' => ['confirmed_fake_orders' => $match->orders, 'order_ids' => $match->orderIds],
                'explanation' => 'The '.self::LABELS[$type]." is linked to a previously confirmed fake order (+{$weight}).",
            ];
        }
        $histCapped = min($hist, (int) config('fraud.historical.cap'));

        $outcomePoints = 0;
        $cfg = config('fraud.outcome');
        if ($outcome->enabled && $outcome->orders >= $cfg['min_count']) {
            $outcomePoints = min($outcome->orders * $cfg['points_per_order'], (int) $cfg['cap']);
            $reasons[] = [
                'rule' => 'outcome.phone',
                'component' => 'outcome',
                'identifier' => 'phone',
                'points' => $outcomePoints,
                'evidence' => ['orders' => $outcome->orders, 'statuses' => $outcome->statuses],
                'explanation' => "{$outcome->orders} earlier orders from this phone ended with a documented suspicious outcome (+{$outcomePoints}).",
            ];
        }

        $excludedPoints = $excludedIp?->points ?? 0;
        if ($excludedIp !== null && $excludedPoints > 0) {
            $reasons[] = [
                'rule' => 'excluded_ip.ip',
                'component' => 'excluded_ip',
                'identifier' => 'ip',
                'points' => $excludedPoints,
                'evidence' => ['pattern' => $excludedIp->pattern, 'specificity' => $excludedIp->specificity],
                'explanation' => "The IP address matches the excluded entry {$excludedIp->pattern}; the more precise the entry, the more points (+{$excludedPoints}).",
            ];
        }

        $score = min(100, $dailyCapped + $histCapped + $outcomePoints + $excludedPoints);
        $level = FraudRiskLevel::fromScore($score);

        return new FraudScore(
            score: $score,
            riskLevel: $level,
            recommendedAction: $level->recommendedAction(),
            dailyPoints: $dailyCapped,
            historicalPoints: $histCapped,
            outcomePoints: $outcomePoints,
            excludedIpPoints: $excludedPoints,
            counts: $dailyCounts,
            historical: $historical,
            reasons: $reasons,
            rulesVersion: config('fraud.rules_version'),
            assessedAt: now(),
        );
    }
}
