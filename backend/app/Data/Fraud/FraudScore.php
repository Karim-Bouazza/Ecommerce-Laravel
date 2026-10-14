<?php

namespace App\Data\Fraud;

use App\Enums\Fraud\FraudRiskLevel;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;

/** Outcome of scoring: totals per component plus the explanation. */
class FraudScore extends Data
{
    /**
     * @param  array<string, int|null>  $counts
     * @param  array<string, HistoricalMatch|null>  $historical
     * @param  list<array<string, mixed>>  $reasons
     */
    public function __construct(
        public int $score,
        public FraudRiskLevel $riskLevel,
        public string $recommendedAction,
        public int $dailyPoints,
        public int $historicalPoints,
        public int $outcomePoints,
        public int $excludedIpPoints,
        public array $counts,
        public array $historical,
        public array $reasons,
        public string $rulesVersion,
        public CarbonInterface $assessedAt,
    ) {}

    /** @return array<string, mixed> columns of the fraud_assessments table */
    public function toAssessmentAttributes(): array
    {
        return [
            'score' => $this->score,
            'risk_level' => $this->riskLevel,
            'recommended_action' => $this->recommendedAction,
            'daily_points' => $this->dailyPoints,
            'historical_points' => $this->historicalPoints,
            'outcome_points' => $this->outcomePoints,
            'excluded_ip_points' => $this->excludedIpPoints,
            'counts' => $this->counts,
            'historical' => array_map(fn (?HistoricalMatch $m) => $m?->toArray(), $this->historical),
            'reasons' => $this->reasons,
            'rules_version' => $this->rulesVersion,
            'assessed_at' => $this->assessedAt,
        ];
    }
}
