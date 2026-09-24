<?php

namespace App\Support\Analytics;

class OrderRateCalculator
{
    public static function percentage(int $part, int $total): float
    {
        return $total > 0 ? round($part / $total * 100, 2) : 0.0;
    }

    public static function confirmationRate(int $confirmedOrLater, int $total): float
    {
        return self::percentage($confirmedOrLater, $total);
    }

    public static function confirmationPerformance(int $confirmedOrLater, int $total, int $pending): float
    {
        return self::percentage($confirmedOrLater, $total - $pending);
    }

    public static function deliveryRate(int $delivered, int $total): float
    {
        return self::percentage($delivered, $total);
    }

    public static function deliveryPerformance(int $delivered, int $deliveryResolved): float
    {
        return self::percentage($delivered, $deliveryResolved);
    }
}
