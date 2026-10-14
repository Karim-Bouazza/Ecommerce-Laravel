<?php

namespace App\Services\Fraud;

use App\Models\Fraud\FraudAssessment;
use App\Models\Fraud\FraudAssessmentHistory;
use App\Models\Order\OrderAttempt;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class FraudAssessmentService
{
    public function __construct(
        private readonly DailyActivityCalculator $daily,
        private readonly HistoricalFraudCalculator $historical,
        private readonly OutcomeCalculator $outcome,
        private readonly ExcludedIpCalculator $excludedIp,
        private readonly FraudScoringService $scoring,
    ) {}

    /**
     * Idempotent: one assessment row per order (unique order_id); re-running
     * overwrites it and only appends a history row when the score/level changed.
     */
    public function assessOrder(int $orderId, string $trigger): ?FraudAssessment
    {
        $attempt = FraudIdentifiers::createdOrderAttempts()
            ->where('order_id', $orderId)
            ->orderBy('id')
            ->first();

        if (! $attempt) {
            return null; // e.g. manual orders have no storefront attempt
        }

        try {
            return $this->persist($attempt, $trigger);
        } catch (UniqueConstraintViolationException) {
            // Concurrent first assessment of the same order: the row now exists, update it.
            return $this->persist($attempt, $trigger);
        }
    }

    /** Re-assess other orders created the same business day that share an identifier. */
    public function recalculateRelatedSameDay(OrderAttempt $attempt): int
    {
        $keys = FraudIdentifiers::keysOf($attempt);
        if ($keys === []) {
            return 0;
        }

        [$from, $to] = FraudIdentifiers::dayBounds($attempt->created_at);

        $orderIds = FraudIdentifiers::sharingAnyKey(
            FraudIdentifiers::createdOrderAttempts()
                ->where('order_id', '!=', $attempt->order_id)
                ->whereBetween('created_at', [$from, $to]),
            $keys
        )->distinct()->pluck('order_id');

        foreach ($orderIds as $orderId) {
            $this->assessOrder((int) $orderId, 'related_order');
        }

        return $orderIds->count();
    }

    /** Re-assess every LATER order sharing an identifier (used after a review change). */
    public function recalculateAfterReview(OrderAttempt $reviewed): int
    {
        $keys = FraudIdentifiers::keysOf($reviewed);
        if ($keys === []) {
            return 0;
        }

        $count = 0;

        FraudIdentifiers::sharingAnyKey(
            FraudIdentifiers::createdOrderAttempts()
                ->where('id', '>', $reviewed->id)
                ->where('order_id', '!=', $reviewed->order_id),
            $keys
        )->select('order_id')->distinct()->orderBy('order_id')
            ->chunk(200, function ($rows) use (&$count) {
                foreach ($rows as $row) {
                    $this->assessOrder((int) $row->order_id, 'review_changed');
                    $count++;
                }
            });

        return $count;
    }

    private function persist(OrderAttempt $attempt, string $trigger): FraudAssessment
    {
        $result = $this->scoring->score(
            $this->daily->counts($attempt),
            $this->historical->matches($attempt),
            $this->outcome->count($attempt),
            $this->excludedIp->match($attempt),
        );

        return DB::transaction(function () use ($attempt, $result, $trigger) {
            $existing = FraudAssessment::query()
                ->where('order_id', $attempt->order_id)
                ->lockForUpdate()
                ->first();

            $assessment = $existing ?? new FraudAssessment(['order_id' => $attempt->order_id]);
            $oldScore = $existing?->score;
            $oldLevel = $existing?->risk_level?->value;

            $assessment->fill([
                ...$result->toAssessmentAttributes(),
                'order_attempt_id' => $attempt->id,
            ])->save();

            if ($existing === null || $oldScore !== $result->score || $oldLevel !== $result->riskLevel->value) {
                FraudAssessmentHistory::create([
                    'fraud_assessment_id' => $assessment->id,
                    'old_score' => $oldScore,
                    'new_score' => $result->score,
                    'old_risk_level' => $oldLevel,
                    'new_risk_level' => $result->riskLevel->value,
                    'trigger' => $trigger,
                ]);
            }

            return $assessment;
        });
    }
}
