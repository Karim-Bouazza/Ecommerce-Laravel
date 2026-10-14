<?php

namespace App\Services\Fraud;

use App\Enums\Order\OrderAttemptStatus;
use App\Models\Order\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Observe-only entry point called after an order is created. It never throws
 * and never influences whether an order is accepted.
 */
class FraudDetectionService
{
    public function __construct(
        private readonly OrderAttemptRecorder $recorder,
        private readonly FraudAssessmentService $assessments,
    ) {}

    /** @param array<string, mixed> $input */
    public function handleCreatedOrder(Order $order, Request $request, array $input = []): void
    {
        try {
            $attempt = $this->recorder->record($request, OrderAttemptStatus::OrderCreated, $input, $order);
            $this->assessments->assessOrder($order->id, 'order_created');
            $this->assessments->recalculateRelatedSameDay($attempt);
        } catch (Throwable $e) {
            // Deliberately no message/bindings: they may contain customer data.
            Log::error('Fraud assessment failed', [
                'order_id' => $order->id,
                'exception' => $e::class,
            ]);
        }
    }

    /** @param array<string, mixed> $input */
    public function handleValidationFailure(Request $request, array $input = []): void
    {
        try {
            $this->recorder->record($request, OrderAttemptStatus::ValidationFailed, $input);
        } catch (Throwable $e) {
            Log::error('Fraud attempt recording failed', ['exception' => $e::class]);
        }
    }
}
