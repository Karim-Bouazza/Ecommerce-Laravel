<?php

namespace App\Services\OrderAnalysis;

use App\Enums\OrderStatus;
use App\Queries\Orders\OrderAnalysisQuery;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\OrderAnalysis\OrderAnalysisFilters;

class GetOrderStatusBreakdownService
{
    /**
     * Every status belongs to exactly one group, so the groups add up to all orders.
     *
     * @var array<string, array{label: string, statuses: array<int, OrderStatus>}>
     */
    private const GROUPS = [
        'confirmation' => ['label' => 'Confirmation', 'statuses' => [
            OrderStatus::New,
            OrderStatus::Call1,
            OrderStatus::Call2,
            OrderStatus::Call3,
            OrderStatus::ToCheck,
            OrderStatus::Reported,
            OrderStatus::Scheduled,
            OrderStatus::Confirmed,
            OrderStatus::ConfirmedBot,
            OrderStatus::ConfirmedNoStock,
            OrderStatus::Assigned,
        ]],
        'cancelled' => ['label' => 'Annulée', 'statuses' => [
            OrderStatus::Cancelled,
            OrderStatus::Duplicated,
            OrderStatus::FakeOrder,
            OrderStatus::Unreachable,
        ]],
        'tracking' => ['label' => 'Suivi', 'statuses' => [
            OrderStatus::Shipped,
            OrderStatus::ReturnInProgress,
        ]],
        'completed' => ['label' => 'Terminées', 'statuses' => [
            OrderStatus::Delivered,
            OrderStatus::Returned,
        ]],
    ];

    public function __construct(private readonly OrderAnalysisQuery $query) {}

    /**
     * @return array{total: int, groups: list<array<string, mixed>>}
     */
    public function execute(OrderAnalysisFilters $filters): array
    {
        $counts = $this->query->countsByStatus($filters);
        $total = array_sum($counts);

        $groups = [];
        foreach (self::GROUPS as $key => $group) {
            $statuses = array_map(fn (OrderStatus $status) => [
                'status' => $status->value,
                'label' => $status->label(),
                'color' => $status->color(),
                'count' => $counts[$status->value] ?? 0,
                'percentage' => OrderRateCalculator::percentage($counts[$status->value] ?? 0, $total),
            ], $group['statuses']);

            $groups[] = [
                'key' => $key,
                'label' => $group['label'],
                'total' => array_sum(array_column($statuses, 'count')),
                'statuses' => $statuses,
            ];
        }

        return ['total' => $total, 'groups' => $groups];
    }
}
