<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class ProductProfit
{
    /**
     * Gross profit for a product from delivered orders created on the given date:
     * sum of item revenue minus purchase cost, attributed to the order's creation date.
     */
    public static function deliveredProfitFor(Product $product, Carbon $date): int
    {
        return OrderItem::where('product_id', $product->id)
            ->whereHas('order', fn (Builder $query) => $query
                ->where('status', OrderStatus::Delivered)
                ->whereDate('created_at', $date))
            ->get()
            ->sum(fn (OrderItem $item) => $item->total_price - ($product->purchase_price ?? 0) * $item->quantity);
    }
}
