<?php

namespace App\Support\Analytics;

class ProductAnalyticsCalculator
{
    public static function cost(int $deliveredQuantity, ?int $purchasePrice): ?float
    {
        return $purchasePrice !== null ? $deliveredQuantity * $purchasePrice : null;
    }

    public static function margin(float $sales, ?float $cost): ?float
    {
        return $cost !== null ? $sales - $cost : null;
    }

    public static function profitPercentage(?float $margin, float $sales): float
    {
        return $margin !== null && $sales > 0 ? round($margin / $sales * 100, 2) : 0.0;
    }
}
