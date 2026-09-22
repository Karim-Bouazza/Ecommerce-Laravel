<?php

namespace App\Queries\Products;

use App\Enums\OrderStatus;
use App\Models\Product;
use Closure;
use Illuminate\Database\Eloquent\Builder;

class ProductAnalyticsQuery
{
    private const CONFIRMED_OR_LATER = [
        OrderStatus::Confirmed,
        OrderStatus::ConfirmedBot,
        OrderStatus::ConfirmedNoStock,
        OrderStatus::Assigned,
        OrderStatus::Shipped,
        OrderStatus::Delivered,
        OrderStatus::ReturnInProgress,
        OrderStatus::Returned,
    ];

    private const PENDING = [
        OrderStatus::New,
        OrderStatus::Reported,
        OrderStatus::Call1,
        OrderStatus::Call2,
        OrderStatus::Call3,
        OrderStatus::Unreachable,
        OrderStatus::ToCheck,
        OrderStatus::Scheduled,
    ];

    private const DELIVERY_RESOLVED = [
        OrderStatus::Delivered,
        OrderStatus::Returned,
        OrderStatus::ReturnInProgress,
    ];

    public function build(?string $search = null, ?string $dateFrom = null, ?string $dateTo = null): Builder
    {
        return Product::query()
            ->select(['id', 'name', 'image_1', 'purchase_price'])
            ->withCount(['orderItems as total_orders_count' => $this->dateScope($dateFrom, $dateTo)])
            ->withSum(['orderItems as total_quantity' => $this->dateScope($dateFrom, $dateTo)], 'quantity')
            ->withCount(['orderItems as confirmed_no_stock_count' => $this->statusScope(OrderStatus::ConfirmedNoStock, $dateFrom, $dateTo)])
            ->withSum(['orderItems as confirmed_no_stock_quantity' => $this->statusScope(OrderStatus::ConfirmedNoStock, $dateFrom, $dateTo)], 'quantity')
            ->withCount(['orderItems as confirmed_count' => $this->statusScope(OrderStatus::Confirmed, $dateFrom, $dateTo)])
            ->withSum(['orderItems as confirmed_quantity' => $this->statusScope(OrderStatus::Confirmed, $dateFrom, $dateTo)], 'quantity')
            ->withCount(['orderItems as delivered_count' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo)])
            ->withSum(['orderItems as delivered_quantity' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo)], 'quantity')
            ->withSum(['orderItems as delivered_sales_value' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo)], 'total_price')
            ->withCount(['orderItems as returned_count' => $this->statusScope(OrderStatus::Returned, $dateFrom, $dateTo)])
            ->withSum(['orderItems as returned_quantity' => $this->statusScope(OrderStatus::Returned, $dateFrom, $dateTo)], 'quantity')
            ->withCount(['orderItems as confirmed_or_later_count' => $this->statusScope(self::CONFIRMED_OR_LATER, $dateFrom, $dateTo)])
            ->withCount(['orderItems as pending_count' => $this->statusScope(self::PENDING, $dateFrom, $dateTo)])
            ->withCount(['orderItems as delivery_resolved_count' => $this->statusScope(self::DELIVERY_RESOLVED, $dateFrom, $dateTo)])
            ->when($search, fn (Builder $query) => $query->where('name', 'like', "%{$search}%"));
    }

    private function statusScope(OrderStatus|array $status, ?string $dateFrom, ?string $dateTo): Closure
    {
        return function (Builder $query) use ($status, $dateFrom, $dateTo) {
            $query->whereHas('order', function (Builder $query) use ($status, $dateFrom, $dateTo) {
                is_array($status) ? $query->whereIn('status', $status) : $query->where('status', $status);
                $this->applyDateRange($query, $dateFrom, $dateTo);
            });
        };
    }

    private function dateScope(?string $dateFrom, ?string $dateTo): Closure
    {
        return function (Builder $query) use ($dateFrom, $dateTo) {
            $query->whereHas('order', function (Builder $query) use ($dateFrom, $dateTo) {
                $this->applyDateRange($query, $dateFrom, $dateTo);
            });
        };
    }

    private function applyDateRange(Builder $query, ?string $dateFrom, ?string $dateTo): void
    {
        $query
            ->when($dateFrom, fn (Builder $query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn (Builder $query) => $query->whereDate('created_at', '<=', $dateTo));
    }
}
