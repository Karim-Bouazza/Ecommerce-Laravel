<?php

namespace App\Support\Analytics;

class ProductAnalyticsCalculator
{
    public static function confirmationRate(int $confirmedOrLater, int $total): float
    {
        return $total > 0 ? round($confirmedOrLater / $total * 100, 2) : 0.0;
    }

    public static function confirmationPerformance(int $confirmedOrLater, int $total, int $pending): float
    {
        $resolved = $total - $pending;

        return $resolved > 0 ? round($confirmedOrLater / $resolved * 100, 2) : 0.0;
    }

    public static function deliveryRate(int $delivered, int $total): float
    {
        return $total > 0 ? round($delivered / $total * 100, 2) : 0.0;
    }

    public static function deliveryPerformance(int $delivered, int $deliveryResolved): float
    {
        return $deliveryResolved > 0 ? round($delivered / $deliveryResolved * 100, 2) : 0.0;
    }

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
