<?php

namespace App\Queries\Wilayas;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Wilaya;
use Closure;
use Illuminate\Database\Eloquent\Builder;

class WilayaAnalyticsQuery
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
        ?int $productId = null,
        ?float $priceMin = null,
        ?float $priceMax = null,
    ): Builder {
        return Wilaya::query()
            ->select(['id', 'name'])
            ->withCount(['orders as total_orders_count' => $this->dateScope($dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as confirmed_count' => $this->statusScope(OrderStatus::Confirmed, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as delivered_count' => $this->statusScope(OrderStatus::Delivered, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as returned_count' => $this->statusScope(OrderStatus::Returned, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as confirmed_or_later_count' => $this->statusScope(self::CONFIRMED_OR_LATER, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as pending_count' => $this->statusScope(self::PENDING, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->withCount(['orders as delivery_resolved_count' => $this->statusScope(self::DELIVERY_RESOLVED, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)])
            ->when($search, fn (Builder $query) => $query->where('name', 'like', "%{$search}%"));
    }

    /**
     * Nationwide totals for the same filters, used to express each wilaya's
     * volume metrics as a share of the whole (independent of the per-wilaya grouping/pagination).
     *
     * @return array{total_orders_count: int, confirmed_count: int, delivered_count: int, returned_count: int, confirmed_or_later_count: int, pending_count: int, delivery_resolved_count: int}
     */
    public function totals(
        ?string $dateFrom = null,
        ?string $dateTo = null,
        ?int $productId = null,
        ?float $priceMin = null,
        ?float $priceMax = null,
    ): array {
        $base = function () use ($dateFrom, $dateTo, $productId, $priceMin, $priceMax): Builder {
            $query = Order::query();
            $this->applyFilters($query, $dateFrom, $dateTo, $productId, $priceMin, $priceMax);

            return $query;
        };

        return [
            'total_orders_count' => $base()->count(),
            'confirmed_count' => $base()->where('status', OrderStatus::Confirmed)->count(),
            'delivered_count' => $base()->where('status', OrderStatus::Delivered)->count(),
            'returned_count' => $base()->where('status', OrderStatus::Returned)->count(),
            'confirmed_or_later_count' => $base()->whereIn('status', self::CONFIRMED_OR_LATER)->count(),
            'pending_count' => $base()->whereIn('status', self::PENDING)->count(),
            'delivery_resolved_count' => $base()->whereIn('status', self::DELIVERY_RESOLVED)->count(),
        ];
    }

    private function statusScope(
        OrderStatus|array $status,
        ?string $dateFrom,
        ?string $dateTo,
        ?int $productId,
        ?float $priceMin,
        ?float $priceMax,
    ): Closure {
        return function (Builder $query) use ($status, $dateFrom, $dateTo, $productId, $priceMin, $priceMax) {
            is_array($status) ? $query->whereIn('status', $status) : $query->where('status', $status);
            $this->applyFilters($query, $dateFrom, $dateTo, $productId, $priceMin, $priceMax);
        };
    }

    private function dateScope(
        ?string $dateFrom,
        ?string $dateTo,
        ?int $productId,
        ?float $priceMin,
        ?float $priceMax,
    ): Closure {
        return function (Builder $query) use ($dateFrom, $dateTo, $productId, $priceMin, $priceMax) {
            $this->applyFilters($query, $dateFrom, $dateTo, $productId, $priceMin, $priceMax);
        };
    }

    private function applyFilters(
        Builder $query,
        ?string $dateFrom,
        ?string $dateTo,
        ?int $productId,
        ?float $priceMin,
        ?float $priceMax,
    ): void {
        $query
            ->when($dateFrom, fn (Builder $query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn (Builder $query) => $query->whereDate('created_at', '<=', $dateTo))
            ->when(
                $productId,
                fn (Builder $query) => $query->whereHas('items', fn (Builder $query) => $query->where('product_id', $productId)),
            )
            ->when($priceMin !== null, fn (Builder $query) => $query->where('total_price', '>=', $priceMin))
            ->when($priceMax !== null, fn (Builder $query) => $query->where('total_price', '<=', $priceMax));
    }
}
