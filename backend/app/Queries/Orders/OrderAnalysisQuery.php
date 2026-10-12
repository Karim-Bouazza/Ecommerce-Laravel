<?php

namespace App\Queries\Orders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Support\OrderAnalysis\OrderAnalysisFilters;
use Illuminate\Database\Eloquent\Builder;

class OrderAnalysisQuery
{
    /**
     * Number of orders per status, keyed by the status value.
     *
     * @return array<string, int>
     */
    public function countsByStatus(OrderAnalysisFilters $filters): array
    {
        return $this->orders($filters)
            ->toBase()
            ->selectRaw('orders.status, COUNT(*) as total')
            ->groupBy('orders.status')
            ->pluck('total', 'status')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    /**
     * Cancelled orders that were already handed to delivery when they were cancelled.
     *
     * @param  array<int, OrderStatus>  $trackingStatuses
     */
    public function cancelledDuringTracking(OrderAnalysisFilters $filters, array $trackingStatuses): int
    {
        $values = array_map(fn (OrderStatus $status) => $status->value, $trackingStatuses);

        return $this->orders($filters)
            ->where('orders.status', OrderStatus::Cancelled)
            ->whereExists(function ($history) use ($values) {
                $history->selectRaw('1')
                    ->from('order_status_histories')
                    ->whereColumn('order_status_histories.order_id', 'orders.id')
                    ->where('order_status_histories.status', OrderStatus::Cancelled->value)
                    ->whereIn('order_status_histories.previous_status', $values);
            })
            ->count();
    }

    /**
     * Orders matching the shared analysis filters (period, product, wilaya).
     *
     * @return Builder<Order>
     */
    public function orders(OrderAnalysisFilters $filters): Builder
    {
        return Order::query()
            ->when($filters->from || $filters->to, function (Builder $query) use ($filters) {
                $filters->byStatusChangeDate
                    ? $this->whereStatusChangedBetween($query, $filters)
                    : $this->whereCreatedBetween($query, $filters);
            })
            ->when(
                $filters->wilayaId,
                fn (Builder $query, int $wilayaId) => $query->whereHas('client', fn (Builder $client) => $client->where('wilaya_id', $wilayaId)),
            )
            ->when(
                $filters->productId,
                fn (Builder $query, int $productId) => $query->whereHas('items', fn (Builder $items) => $items->where('product_id', $productId)),
            );
    }

    /**
     * @param  Builder<Order>  $query
     */
    private function whereCreatedBetween(Builder $query, OrderAnalysisFilters $filters): void
    {
        $query
            ->when($filters->from, fn (Builder $q, $from) => $q->where('orders.created_at', '>=', $from))
            ->when($filters->to, fn (Builder $q, $to) => $q->where('orders.created_at', '<=', $to));
    }

    /**
     * Uses the date the order reached its current status.
     *
     * @param  Builder<Order>  $query
     */
    private function whereStatusChangedBetween(Builder $query, OrderAnalysisFilters $filters): void
    {
        $query->whereExists(function ($history) use ($filters) {
            $history->selectRaw('1')
                ->from('order_status_histories')
                ->whereColumn('order_status_histories.order_id', 'orders.id')
                ->whereColumn('order_status_histories.status', 'orders.status')
                ->when($filters->from, fn ($q, $from) => $q->where('order_status_histories.created_at', '>=', $from))
                ->when($filters->to, fn ($q, $to) => $q->where('order_status_histories.created_at', '<=', $to));
        });
    }
}
