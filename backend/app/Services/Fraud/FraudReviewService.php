<?php

namespace App\Services\Fraud;

use App\Enums\Fraud\FraudReviewLabel;
use App\Models\Fraud\FraudReview;
use App\Models\Order\Order;
use App\Models\Users\User;

class FraudReviewService
{
    public function __construct(private readonly FraudAssessmentService $assessments) {}

    /**
     * Records a human decision (who/when/why) and rescoring the affected orders.
     * Order status is never touched: a cancelled order is not "fake" by itself.
     */
    public function setLabel(Order $order, FraudReviewLabel $label, ?string $reason, User $reviewer): FraudReview
    {
        $review = FraudReview::updateOrCreate(
            ['order_id' => $order->id],
            [
                'label' => $label,
                'reason' => $reason,
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ],
        );

        $attempt = FraudIdentifiers::createdOrderAttempts()
            ->where('order_id', $order->id)
            ->orderBy('id')
            ->first();

        if ($attempt) {
            $this->assessments->assessOrder($order->id, 'review_changed');
            $this->assessments->recalculateAfterReview($attempt);
        }

        return $review->load('reviewer');
    }
}
