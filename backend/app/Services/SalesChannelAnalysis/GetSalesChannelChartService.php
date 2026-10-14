<?php

namespace App\Services\SalesChannelAnalysis;

use App\Enums\Order\OrderType;
use App\Queries\SalesChannels\SalesChannelAnalysisQuery;
use App\Support\SalesChannelAnalysis\SalesChannelFilters;
use Carbon\CarbonImmutable;

class GetSalesChannelChartService
{
    /** Longer periods are rolled up per month to keep the chart readable. */
    private const MAX_DAILY_POINTS = 62;

    public function __construct(private readonly SalesChannelAnalysisQuery $query) {}

    /**
     * Orders over time, one series per sales channel, gaps filled with zeros.
     *
     * @return array{granularity: string, series: array<int, array{key: string, label: string}>, points: array<int, array<string, int|string>>}
     */
    public function execute(SalesChannelFilters $filters): array
    {
        $rows = $this->query->dailyCountsByType($filters->orders);

        $totals = [];
        foreach ($rows as $row) {
            $totals[$row->type] = ($totals[$row->type] ?? 0) + (int) $row->total;
        }

        $types = array_values(array_filter(
            OrderType::cases(),
            fn (OrderType $type) => $filters->accepts($totals[$type->value] ?? 0),
        ));
        $series = array_map(fn (OrderType $type) => ['key' => $type->value, 'label' => $type->label()], $types);

        if ($rows->isEmpty() || $types === []) {
            return ['granularity' => 'day', 'series' => $series, 'points' => []];
        }

        $start = $filters->orders->from ?? CarbonImmutable::parse($rows->first()->day);
        $end = $filters->orders->to ?? CarbonImmutable::now();
        $monthly = $start->startOfDay()->diffInDays($end->startOfDay()) > self::MAX_DAILY_POINTS;

        $points = [];
        for ($cursor = $monthly ? $start->startOfMonth() : $start->startOfDay(); $cursor <= $end; $cursor = $monthly ? $cursor->addMonth() : $cursor->addDay()) {
            $points[$cursor->format($monthly ? 'Y-m' : 'Y-m-d')] = array_fill_keys(array_column($series, 'key'), 0);
        }

        foreach ($rows as $row) {
            $bucket = $monthly ? substr($row->day, 0, 7) : $row->day;
            if (isset($points[$bucket][$row->type])) {
                $points[$bucket][$row->type] += (int) $row->total;
            }
        }

        return [
            'granularity' => $monthly ? 'month' : 'day',
            'series' => $series,
            'points' => array_map(
                fn (string $date, array $counts) => ['date' => $date, ...$counts],
                array_keys($points),
                $points,
            ),
        ];
    }
}
