<?php

namespace App\Services\Fraud;

use App\Models\Order\OrderAttempt;

class DailyActivityCalculator
{
    /**
     * Counts successfully created orders (not failed attempts) per identifier
     * within the business calendar day of the attempt. One indexed COUNT per
     * identifier; missing identifiers yield null and are skipped by scoring.
     *
     * @return array<string, int|null> type → orders that day
     */
    public function counts(OrderAttempt $attempt): array
    {
        [$from, $to] = FraudIdentifiers::dayBounds($attempt->created_at);
        $keys = FraudIdentifiers::keysOf($attempt);
        $counts = [];

        foreach (FraudIdentifiers::COLUMNS as $type => $column) {
            $counts[$type] = isset($keys[$type])
                ? FraudIdentifiers::createdOrderAttempts()
                    ->where($column, $keys[$type])
                    ->whereBetween('created_at', [$from, $to])
                    ->distinct()
                    ->count('order_id')
                : null;
        }

        return $counts;
    }
}
