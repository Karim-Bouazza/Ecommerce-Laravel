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

    /**
     * Delivered orders out of the confirmed ones.
     */
    public static function deliveryRateOfConfirmed(int $delivered, int $confirmedOrLater): float
    {
        return self::percentage($delivered, $confirmedOrLater);
    }

    /**
     * Confirmed orders against confirmed + cancelled only (new and fake orders are left out).
     */
    public static function confirmationPerformanceVsCancelled(int $confirmedOrLater, int $cancelled): float
    {
        return self::percentage($confirmedOrLater, $confirmedOrLater + $cancelled);
    }

    public static function deliveryPerformance(int $delivered, int $deliveryResolved): float
    {
        return self::percentage($delivered, $deliveryResolved);
    }
}
