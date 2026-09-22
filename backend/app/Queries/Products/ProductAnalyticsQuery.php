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

    public function build(
        ?string $search = null,
        ?string $dateFrom = null,
        ?string $dateTo = null,
        ?int $wilayaId = null,
        ?float $priceMin = null,
        ?float $priceMax = null,
    ): Builder {
        return Product::query()
            ->select(['id', 'name', 'image_1', 'purchase_price', 'price'])
            ->withCount(['orderItems as total_orders_count' => $this->dateScope($dateFrom, $dateTo, $wilayaId)])
            ->withSum(['orderItems as total_quantity' => $this->dateScope($dateFrom, $dateTo, $wilayaId)], 'quantity')
            ->withCount(['orderItems as confirmed_no_stock_count' => $this->statusScope(OrderStatus::ConfirmedNoStock, $dateFrom, $dateTo, $wilayaId)])
            ->withSum(['orderItems as confirmed_no_stock_quantity' => $this->statusScope(OrderStatus::ConfirmedNoStock, $dateFrom, $dateTo, $wilayaId)], 'quantity')
            ->withCount(['orderItems as confirmed_count' => $this->statusScope(OrderStatus::Confirmed, $dateFrom, $dateTo, $wilayaId)])
            ->withSum(['orderItems as confirmed_quantity' => $this->statusScope(OrderStatus::Confirmed, $dateFrom, $dateTo, $wilayaId)], 'quantity')
            ->withCount(['orderItems as delivered_count' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo, $wilayaId)])
            ->withSum(['orderItems as delivered_quantity' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo, $wilayaId)], 'quantity')
            ->withSum(['orderItems as delivered_sales_value' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo, $wilayaId)], 'total_price')
            ->withCount(['orderItems as returned_count' => $this->statusScope(OrderStatus::Returned, $dateFrom, $dateTo, $wilayaId)])
            ->withSum(['orderItems as returned_quantity' => $this->statusScope(OrderStatus::Returned, $dateFrom, $dateTo, $wilayaId)], 'quantity')
            ->withCount(['orderItems as confirmed_or_later_count' => $this->statusScope(self::CONFIRMED_OR_LATER, $dateFrom, $dateTo, $wilayaId)])
            ->withCount(['orderItems as pending_count' => $this->statusScope(self::PENDING, $dateFrom, $dateTo, $wilayaId)])
            ->withCount(['orderItems as delivery_resolved_count' => $this->statusScope(self::DELIVERY_RESOLVED, $dateFrom, $dateTo, $wilayaId)])
            ->when($search, fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
            ->when($priceMin !== null, fn (Builder $query) => $query->where('price', '>=', $priceMin))
            ->when($priceMax !== null, fn (Builder $query) => $query->where('price', '<=', $priceMax));
    }

    private function statusScope(OrderStatus|array $status, ?string $dateFrom, ?string $dateTo, ?int $wilayaId): Closure
    {
        return function (Builder $query) use ($status, $dateFrom, $dateTo, $wilayaId) {
            $query->whereHas('order', function (Builder $query) use ($status, $dateFrom, $dateTo, $wilayaId) {
                is_array($status) ? $query->whereIn('status', $status) : $query->where('status', $status);
                $this->applyDateRange($query, $dateFrom, $dateTo);
                $this->applyWilaya($query, $wilayaId);
            });
        };
    }

    private function dateScope(?string $dateFrom, ?string $dateTo, ?int $wilayaId): Closure
    {
        return function (Builder $query) use ($dateFrom, $dateTo, $wilayaId) {
            $query->whereHas('order', function (Builder $query) use ($dateFrom, $dateTo, $wilayaId) {
                $this->applyDateRange($query, $dateFrom, $dateTo);
                $this->applyWilaya($query, $wilayaId);
            });
        };
    }

    private function applyDateRange(Builder $query, ?string $dateFrom, ?string $dateTo): void
    {
        $query
            ->when($dateFrom, fn (Builder $query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn (Builder $query) => $query->whereDate('created_at', '<=', $dateTo));
    }

    private function applyWilaya(Builder $query, ?int $wilayaId): void
    {
        $query->when(
            $wilayaId,
            fn (Builder $query) => $query->whereHas('client', fn (Builder $query) => $query->where('wilaya_id', $wilayaId)),
        );
    }
}
