<?php

namespace App\Services\Fraud;

use App\Data\Fraud\OutcomeSignal;
use App\Enums\Fraud\FraudReviewLabel;
use App\Models\Fraud\FraudReview;
use App\Models\Order\Order;
use App\Models\Order\OrderAttempt;

class OutcomeCalculator
{
    /**
     * Counts earlier orders of the same phone that ended in a configured
     * "suspicious" status. Disabled by default: the project records no
     * cancellation/refusal reasons, so status alone is weak evidence.
     * Orders a human labelled LEGITIMATE are excluded.
     *
     */
    public function count(OrderAttempt $attempt): OutcomeSignal
    {
        $config = config('fraud.outcome');
        $enabled = (bool) $config['enabled'];
        $statuses = $config['statuses'];

        if (! $enabled || $attempt->phone_key === null) {
            return new OutcomeSignal($enabled, 0, $statuses);
        }

        $orders = Order::query()
            ->whereIn('id', FraudIdentifiers::createdOrderAttempts()
                ->select('order_id')
                ->where('phone_key', $attempt->phone_key)
                ->where('id', '<', $attempt->id))
            ->where('id', '!=', $attempt->order_id)
            ->whereIn('status', $statuses)
            ->whereNotIn('id', FraudReview::query()
                ->select('order_id')
                ->where('label', FraudReviewLabel::Legitimate->value))
            ->count();

        return new OutcomeSignal($enabled, $orders, $statuses);
    }
}
