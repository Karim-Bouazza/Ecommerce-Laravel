<?php

namespace App\Services\Fraud;

use App\Data\Fraud\HistoricalMatch;
use App\Enums\Fraud\FraudReviewLabel;
use App\Models\Fraud\FraudReview;
use App\Models\Order\OrderAttempt;

class HistoricalFraudCalculator
{
    /**
     * For each identifier, finds EARLIER orders sharing it that a human labelled
     * CONFIRMED_FAKE. Ordinary cancellations/returns are never considered here.
     * Each identifier type counts once, however many rows match.
     *
     * @return array<string, HistoricalMatch|null> null when the identifier is missing
     */
    public function matches(OrderAttempt $attempt): array
    {
        $keys = FraudIdentifiers::keysOf($attempt);
        $result = [];

        foreach (FraudIdentifiers::COLUMNS as $type => $column) {
            if (! isset($keys[$type])) {
                $result[$type] = null;

                continue;
            }

            $orderIds = FraudIdentifiers::createdOrderAttempts()
                ->where($column, $keys[$type])
                ->where('id', '<', $attempt->id)
                ->where('order_id', '!=', $attempt->order_id)
                ->whereIn('order_id', FraudReview::query()
                    ->select('order_id')
                    ->where('label', FraudReviewLabel::ConfirmedFake->value))
                ->distinct()
                ->limit(10)
                ->pluck('order_id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $result[$type] = new HistoricalMatch(count($orderIds), $orderIds);
        }

        return $result;
    }
}
