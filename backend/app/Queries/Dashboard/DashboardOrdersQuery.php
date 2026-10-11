<?php

namespace App\Queries\Dashboard;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Support\Analytics\OrderStatusGroups;
use App\Support\Dashboard\DashboardFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DashboardOrdersQuery
{
    /**
     * @return array{total: int, confirmed: int, delivered: int}
     */
    public function counts(DashboardFilters $filters): array
    {
        $confirmedStatuses = array_map(fn (OrderStatus $status) => $status->value, OrderStatusGroups::confirmedOrLater());
        $placeholders = implode(',', array_fill(0, count($confirmedStatuses), '?'));

        $row = $this->orders($filters)
            ->toBase()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("COALESCE(SUM(CASE WHEN orders.status IN ({$placeholders}) THEN 1 ELSE 0 END), 0) as confirmed", $confirmedStatuses)
            ->selectRaw('COALESCE(SUM(CASE WHEN orders.status = ? THEN 1 ELSE 0 END), 0) as delivered', [OrderStatus::Delivered->value])
            ->first();

        return [
            'total' => (int) $row->total,
            'confirmed' => (int) $row->confirmed,
            'delivered' => (int) $row->delivered,
        ];
    }

    public function deliveredSales(DashboardFilters $filters): float
    {
        return (float) $this->deliveredItems($filters)->sum('order_items.total_price');
    }

    /**
     * @return Collection<int, object>
     */
    public function topProducts(DashboardFilters $filters, int $limit): Collection
    {
        return $this->deliveredItems($filters)
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id', 'products.name', 'products.image_1')
            ->orderByDesc('quantity')
            ->orderByDesc('sales')
            ->limit($limit)
            ->get([
                'products.id',
                'products.name',
                'products.image_1',
                DB::raw('COUNT(DISTINCT order_items.order_id) as delivered_orders'),
                DB::raw('SUM(order_items.quantity) as quantity'),
                DB::raw('SUM(order_items.total_price) as sales'),
            ]);
    }

    /**
     * @return Builder<Order>
     */
    private function orders(DashboardFilters $filters): Builder
    {
        return Order::query()
            ->when($filters->from, fn (Builder $query, $from) => $query->where('orders.created_at', '>=', $from))
            ->when($filters->to, fn (Builder $query, $to) => $query->where('orders.created_at', '<=', $to))
            ->when(
                $filters->wilayaId,
                fn (Builder $query, int $wilayaId) => $query->whereHas('client', fn (Builder $client) => $client->where('wilaya_id', $wilayaId)),
            )
            ->when(
                $filters->productId,
                fn (Builder $query, int $productId) => $query->whereHas('items', fn (Builder $items) => $items->where('product_id', $productId)),
            );
    }

    private function deliveredItems(DashboardFilters $filters): QueryBuilder
    {
        $deliveredOrderIds = $this->orders($filters)
            ->where('orders.status', OrderStatus::Delivered)
            ->select('orders.id');

        return DB::table('order_items')
            ->whereIn('order_items.order_id', $deliveredOrderIds)
            ->when($filters->productId, fn (QueryBuilder $query, int $productId) => $query->where('order_items.product_id', $productId));
    }
}
