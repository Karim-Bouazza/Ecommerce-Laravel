<?php

namespace App\Services\OrderAnalysis;

use App\Enums\Order\OrderStatus;
use App\Queries\Orders\OrderAnalysisQuery;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Analytics\OrderStatusGroups;
use App\Support\OrderAnalysis\OrderAnalysisFilters;

class GetOrderAnalysisService
{
    public function __construct(private readonly OrderAnalysisQuery $query) {}

    /**
     * Orders split in two stages: confirmation (up to the confirmation decision) and
     * tracking (what happens once the order is handed to delivery).
     *
     * @return array{confirmation: array<string, int|float>, tracking: array<string, int>}
     */
    public function execute(OrderAnalysisFilters $filters): array
    {
        $counts = $this->query->countsByStatus($filters);
        $sum = fn (array $statuses): int => array_sum(array_map(
            fn (OrderStatus $status) => $counts[$status->value] ?? 0,
            $statuses,
        ));

        $total = array_sum($counts);
        $invalid = $sum(OrderStatusGroups::invalid());
        $valid = $total - $invalid;

        $cancelledInTracking = $this->query->cancelledDuringTracking($filters, OrderStatusGroups::inDelivery());
        $cancelled = $sum([OrderStatus::Cancelled]);

        return [
            'confirmation' => [
                'total_orders' => $total,
                'valid_orders' => $valid,
                'valid_percentage' => OrderRateCalculator::percentage($valid, $total),
                'pending' => $sum(OrderStatusGroups::awaitingConfirmation()),
                'confirmed' => $sum(OrderStatusGroups::confirmedOrLater()),
                'postponed' => $sum(OrderStatusGroups::postponed()),
                'cancelled' => $cancelled - $cancelledInTracking,
                'invalid' => $invalid,
            ],
            'tracking' => [
                'shipped' => $sum([OrderStatus::Assigned]),
                'in_delivery' => $sum([OrderStatus::Shipped]),
                'cancelled' => $cancelledInTracking,
                'delivered' => $sum([OrderStatus::Delivered]),
                'returned' => $sum([OrderStatus::Returned, OrderStatus::ReturnInProgress]),
            ],
        ];
    }
}
