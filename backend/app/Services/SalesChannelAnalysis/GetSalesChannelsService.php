<?php

namespace App\Services\SalesChannelAnalysis;

use App\Enums\Order\OrderStatus;
use App\Enums\Order\OrderType;
use App\Queries\SalesChannels\SalesChannelAnalysisQuery;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Analytics\OrderStatusGroups;
use App\Support\SalesChannelAnalysis\SalesChannelFilters;

class GetSalesChannelsService
{
    public function __construct(private readonly SalesChannelAnalysisQuery $query) {}

    /**
     * One row per sales channel (order type), most active first.
     *
     * @return array<int, array<string, mixed>>
     */
    public function execute(SalesChannelFilters $filters): array
    {
        $counts = [];
        foreach ($this->query->countsByTypeAndStatus($filters->orders) as $row) {
            $counts[$row->type][$row->status] = (int) $row->total;
        }
        $sales = $this->query->deliveredSalesByType($filters->orders);

        $channels = [];
        foreach (OrderType::cases() as $type) {
            $byStatus = $counts[$type->value] ?? [];
            $sum = fn (array $statuses): int => array_sum(array_map(
                fn (OrderStatus $status) => $byStatus[$status->value] ?? 0,
                $statuses,
            ));

            $total = array_sum($byStatus);
            if (! $filters->accepts($total)) {
                continue;
            }

            $confirmed = $sum(OrderStatusGroups::confirmedOrLater());
            $delivered = $sum([OrderStatus::Delivered]);

            $channels[] = [
                'type' => $type->value,
                'kind' => $type->channel(),
                'name' => $type->label(),
                'orders' => $total,
                'confirmed' => $confirmed,
                'delivered' => $delivered,
                'returned' => $sum([OrderStatus::Returned, OrderStatus::ReturnInProgress]),
                'confirmation_rate' => OrderRateCalculator::confirmationRate($confirmed, $total),
                'delivery_rate' => OrderRateCalculator::deliveryRate($delivered, $total),
                'delivery_performance' => OrderRateCalculator::deliveryPerformance(
                    $delivered,
                    $sum(OrderStatusGroups::deliveryResolved()),
                ),
                'sales' => $sales[$type->value] ?? 0.0,
            ];
        }

        usort($channels, fn (array $a, array $b) => $b['orders'] <=> $a['orders']);

        return $channels;
    }
}
