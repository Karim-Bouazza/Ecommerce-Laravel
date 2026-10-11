<?php

namespace App\Services\Performance;

use App\Queries\Performance\PerformanceRevenueQuery;
use App\Support\Performance\PerformanceFilters;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;

class GetPerformanceSalesEvolutionService
{
    public function __construct(private readonly PerformanceRevenueQuery $query) {}

    /**
     * One point per day between the first and last day with sales (or the selected range),
     * so the chart has no gaps.
     *
     * @return array{series: list<array{date: string, ventes: float, capital: float}>}
     */
    public function execute(PerformanceFilters $filters): array
    {
        $totals = $this->query->dailyDeliveredTotals($filters);

        if ($totals === []) {
            return ['series' => []];
        }

        $days = array_keys($totals);
        $start = CarbonImmutable::parse($filters->from ?? min($days))->startOfDay();
        $end = CarbonImmutable::parse($filters->to ?? max($days))->startOfDay();

        $series = [];
        foreach (CarbonPeriod::create($start, $end) as $date) {
            $key = $date->format('Y-m-d');
            $series[] = [
                'date' => $key,
                'ventes' => $totals[$key]['ventes'] ?? 0.0,
                'capital' => $totals[$key]['capital'] ?? 0.0,
            ];
        }

        return ['series' => $series];
    }
}
