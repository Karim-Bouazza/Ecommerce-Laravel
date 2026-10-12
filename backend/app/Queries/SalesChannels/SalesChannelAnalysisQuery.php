<?php

namespace App\Queries\SalesChannels;

use App\Enums\OrderStatus;
use App\Queries\Orders\OrderAnalysisQuery;
use App\Support\OrderAnalysis\OrderAnalysisFilters;
use Illuminate\Support\Collection;

class SalesChannelAnalysisQuery
{
    public function __construct(private readonly OrderAnalysisQuery $orders) {}

    /**
     * Number of orders per channel (order type) and status.
     *
     * @return Collection<int, object{type: string, status: string, total: int}>
     */
    public function countsByTypeAndStatus(OrderAnalysisFilters $filters): Collection
    {
        return $this->orders->orders($filters)
            ->toBase()
            ->selectRaw('orders.type, orders.status, COUNT(*) as total')
            ->groupBy('orders.type', 'orders.status')
            ->get();
    }

    /**
     * Sales of delivered orders per channel (order type).
     *
     * @return array<string, float>
     */
    public function deliveredSalesByType(OrderAnalysisFilters $filters): array
    {
        return $this->orders->orders($filters)
            ->toBase()
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', OrderStatus::Delivered->value)
            ->when($filters->productId, fn ($query, int $productId) => $query->where('order_items.product_id', $productId))
            ->selectRaw('orders.type, COALESCE(SUM(order_items.total_price), 0) as sales')
            ->groupBy('orders.type')
            ->pluck('sales', 'type')
            ->map(fn ($sales) => (float) $sales)
            ->all();
    }

    /**
     * Number of orders per channel (order type) and creation day.
     *
     * @return Collection<int, object{type: string, day: string, total: int}>
     */
    public function dailyCountsByType(OrderAnalysisFilters $filters): Collection
    {
        return $this->orders->orders($filters)
            ->toBase()
            ->selectRaw('orders.type, DATE(orders.created_at) as day, COUNT(*) as total')
            ->groupBy('orders.type', 'day')
            ->orderBy('day')
            ->get();
    }
}
