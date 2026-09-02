<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Filament\Widgets\Concerns\InteractsWithDashboardPeriod;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductAdSpend;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class OrderStatsOverview extends StatsOverviewWidget
{
    use InteractsWithDashboardPeriod;

    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $totalRevenue = $this->ordersInPeriod($from, $until)->sum('subtotal');
        $totalOrders = $this->ordersInPeriod($from, $until)->count();
        $deliveredOrders = $this->ordersInPeriod($from, $until)->where('status', OrderStatus::Delivered)->count();
        $cancelledOrders = $this->ordersInPeriod($from, $until)->where('status', OrderStatus::Cancelled)->count();
        $returnedOrders = $this->ordersInPeriod($from, $until)->where('status', OrderStatus::Returned)->count();
        $netProfit = $this->netProfit($from, $until);
        $adSpendTotal = $this->adSpendTotalDzd($from, $until);

        $totalProducts = Product::query()
            ->when($from, fn (Builder $query) => $query->whereDate('created_at', '>=', $from))
            ->when($until, fn (Builder $query) => $query->whereDate('created_at', '<=', $until))
            ->count();

        return [
            Stat::make('Chiffre d\'affaires', number_format($totalRevenue, 0, ',', ' ').' DZ')
                ->color('success'),
            Stat::make('Total commandes', $totalOrders),
            Stat::make('Commandes livrées', $deliveredOrders)
                ->color('success'),
            Stat::make('Commandes annulées', $cancelledOrders)
                ->color('danger'),
            Stat::make('Commandes retournées', $returnedOrders)
                ->color('gray'),
            Stat::make('Total produits', $totalProducts),
            Stat::make('Bénéfice net (livrées)', number_format($netProfit, 0, ',', ' ').' DZ')
                ->color('success'),
            Stat::make('Dépenses pub', number_format($adSpendTotal, 0, ',', ' ').' DZ')
                ->color('danger'),
            Stat::make('Bénéfice net après pub', number_format($netProfit - $adSpendTotal, 0, ',', ' ').' DZ')
                ->color('success'),
        ];
    }

    protected function ordersInPeriod(?Carbon $from, ?Carbon $until): Builder
    {
        return Order::query()
            ->when($from, fn (Builder $query) => $query->whereDate('created_at', '>=', $from))
            ->when($until, fn (Builder $query) => $query->whereDate('created_at', '<=', $until));
    }

    /**
     * Net profit for delivered orders: subtotal minus purchase cost
     * (product purchase_price × delivered quantity) of each item.
     */
    protected function netProfit(?Carbon $from, ?Carbon $until): int
    {
        return $this->ordersInPeriod($from, $until)
            ->where('status', OrderStatus::Delivered)
            ->with('items.product')
            ->get()
            ->sum(function (Order $order) {
                $cost = $order->items->sum(
                    fn (OrderItem $item) => ($item->product->purchase_price ?? 0) * $item->quantity
                );

                return $order->subtotal - $cost;
            });
    }

    /**
     * Total ad spend, converted to DZD, for entries whose date falls within the period.
     */
    protected function adSpendTotalDzd(?Carbon $from, ?Carbon $until): float
    {
        $totalUsd = ProductAdSpend::query()
            ->when($from, fn (Builder $query) => $query->whereDate('date', '>=', $from))
            ->when($until, fn (Builder $query) => $query->whereDate('date', '<=', $until))
            ->sum('amount_usd');

        return (float) $totalUsd * config('ads.usd_to_dzd_rate');
    }
}
