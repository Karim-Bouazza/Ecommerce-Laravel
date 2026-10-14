<?php

namespace App\Queries\Performance;

use App\Enums\Order\OrderStatus;
use App\Support\Analytics\OrderStatusGroups;
use App\Support\Performance\PerformanceFilters;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class PerformanceRevenueQuery
{
    /**
     * Sales and purchase cost (capital) of delivered order items.
     *
     * @return array{ventes: float, capital: float}
     */
    public function deliveredTotals(PerformanceFilters $filters): array
    {
        $row = $this->deliveredItems($filters)
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0) as ventes')
            ->selectRaw('COALESCE(SUM(order_items.quantity * products.purchase_price), 0) as capital')
            ->first();

        return [
            'ventes' => (float) $row->ventes,
            'capital' => (float) $row->capital,
        ];
    }

    /**
     * Delivered sales and capital per day, keyed by Y-m-d. The day follows the selected date basis.
     *
     * @return array<string, array{ventes: float, capital: float}>
     */
    public function dailyDeliveredTotals(PerformanceFilters $filters): array
    {
        $day = $filters->byStatusChangeDate
            ? 'DATE((SELECT MAX(h.created_at) FROM order_status_histories h WHERE h.order_id = orders.id AND h.status = orders.status))'
            : 'DATE(orders.created_at)';

        return $this->deliveredItems($filters)
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw("{$day} as day")
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0) as ventes')
            ->selectRaw('COALESCE(SUM(order_items.quantity * products.purchase_price), 0) as capital')
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->filter(fn ($row) => $row->day !== null)
            ->mapWithKeys(fn ($row) => [
                (string) $row->day => ['ventes' => (float) $row->ventes, 'capital' => (float) $row->capital],
            ])
            ->all();
    }

    /**
     * Buyers are clients with at least one delivered order.
     *
     * @return array{buyers: int, repeat_buyers: int, delivered_orders: int, ordering_clients: int}
     */
    public function customerStats(PerformanceFilters $filters): array
    {
        $perBuyer = $this->deliveredItems($filters)
            ->groupBy('orders.client_id')
            ->selectRaw('orders.client_id, COUNT(DISTINCT orders.id) as orders_count')
            ->get();

        return [
            'buyers' => $perBuyer->count(),
            'repeat_buyers' => $perBuyer->where('orders_count', '>=', 2)->count(),
            'delivered_orders' => (int) $perBuyer->sum('orders_count'),
            'ordering_clients' => $this->orderItems($filters)->distinct()->count('orders.client_id'),
        ];
    }

    /**
     * Distinct order counts per status group, used by the performance gauges.
     *
     * @return array{total: int, confirmed_or_later: int, pending: int, cancelled: int, delivered: int, delivery_resolved: int}
     */
    public function orderCounts(PerformanceFilters $filters): array
    {
        $counter = function (array $statuses): string {
            $list = implode(',', array_map(fn (OrderStatus $status) => "'{$status->value}'", $statuses));

            return "COUNT(DISTINCT CASE WHEN orders.status IN ({$list}) THEN orders.id END)";
        };

        $row = $this->orderItems($filters)
            ->selectRaw('COUNT(DISTINCT orders.id) as total')
            ->selectRaw($counter(OrderStatusGroups::confirmedOrLater()).' as confirmed_or_later')
            ->selectRaw($counter(OrderStatusGroups::pending()).' as pending')
            ->selectRaw($counter([OrderStatus::Cancelled]).' as cancelled')
            ->selectRaw($counter([OrderStatus::Delivered]).' as delivered')
            ->selectRaw($counter(OrderStatusGroups::deliveryResolved()).' as delivery_resolved')
            ->first();

        return [
            'total' => (int) $row->total,
            'confirmed_or_later' => (int) $row->confirmed_or_later,
            'pending' => (int) $row->pending,
            'cancelled' => (int) $row->cancelled,
            'delivered' => (int) $row->delivered,
            'delivery_resolved' => (int) $row->delivery_resolved,
        ];
    }

    private function deliveredItems(PerformanceFilters $filters): Builder
    {
        return $this->orderItems($filters)
            ->where('orders.status', OrderStatus::Delivered->value);
    }

    private function orderItems(PerformanceFilters $filters): Builder
    {
        return DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->when($filters->productId, fn (Builder $q, int $id) => $q->where('order_items.product_id', $id))
            ->when($filters->warehouseId, fn (Builder $q, int $id) => $q->where('order_items.warehouse_id', $id))
            ->when($filters->from || $filters->to, function (Builder $q) use ($filters) {
                $filters->byStatusChangeDate
                    ? $this->whereStatusChangedBetween($q, $filters)
                    : $this->whereCreatedBetween($q, $filters);
            });
    }

    private function whereCreatedBetween(Builder $query, PerformanceFilters $filters): void
    {
        $query
            ->when($filters->from, fn (Builder $q, $from) => $q->where('orders.created_at', '>=', $from))
            ->when($filters->to, fn (Builder $q, $to) => $q->where('orders.created_at', '<=', $to));
    }

    /**
     * Uses the date the order reached its current status.
     */
    private function whereStatusChangedBetween(Builder $query, PerformanceFilters $filters): void
    {
        $query->whereExists(function (Builder $history) use ($filters) {
            $history->selectRaw('1')
                ->from('order_status_histories')
                ->whereColumn('order_status_histories.order_id', 'orders.id')
                ->whereColumn('order_status_histories.status', 'orders.status')
                ->when($filters->from, fn (Builder $q, $from) => $q->where('order_status_histories.created_at', '>=', $from))
                ->when($filters->to, fn (Builder $q, $to) => $q->where('order_status_histories.created_at', '<=', $to));
        });
    }
}
