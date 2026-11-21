<?php

namespace App\Data\Fraud;

use App\Models\Fraud\FraudAssessment;
use Spatie\LaravelData\Data;

class FraudAssessmentData extends Data
{
    public function __construct(
        public mixed $order_id,
        public ?string $order_reference,
        public ?string $order_status,
        public ?string $order_status_label,
        public ?string $customer_name,
        public ?string $customer_phone,
        public mixed $score,
        public string $risk_level,
        public mixed $recommended_action,
        public mixed $daily_points,
        public mixed $historical_points,
        public mixed $outcome_points,
        public mixed $excluded_ip_points,
        public mixed $counts,
        public array $confirmed_fake_matches,
        public ?string $browser,
        public ?string $os,
        public ?string $device_category,
        public ?string $ip_address,
        public bool $has_fingerprint,
        public array $review,
        public mixed $rules_version,
        public ?string $assessed_at,
        public ?string $order_created_at,
    ) {}

    public static function fromAssessment(FraudAssessment $assessment, bool $sensitive = false): self
    {
        $order = $assessment->order;
        $attempt = $assessment->attempt;
        $review = $order?->fraudReview;

        $confirmedFakeMatches = collect($assessment->historical ?? [])
            ->filter(fn ($m) => ($m['orders'] ?? 0) > 0)
            ->map(fn ($m) => $m['orders'])
            ->all();

        return new self(
            order_id: $assessment->order_id,
            order_reference: $order?->reference,
            order_status: $order?->status?->value,
            order_status_label: $order?->status?->label(),
            customer_name: $order?->client ? trim($order->client->first_name . ' ' . $order->client->last_name) : null,
            customer_phone: self::phone($order?->client?->phone_number, $sensitive),
            score: $assessment->score,
            risk_level: $assessment->risk_level->value,
            recommended_action: $assessment->recommended_action,
            daily_points: $assessment->daily_points,
            historical_points: $assessment->historical_points,
            outcome_points: $assessment->outcome_points,
            excluded_ip_points: $assessment->excluded_ip_points,
            counts: $assessment->counts,
            confirmed_fake_matches: $confirmedFakeMatches,
            browser: $attempt ? trim(($attempt->browser_name ?? '') . ' ' . ($attempt->browser_version ?? '')) ?: null : null,
            os: $attempt ? trim(($attempt->os_name ?? '') . ' ' . ($attempt->os_version ?? '')) ?: null : null,
            device_category: $attempt?->device_category,
            ip_address: $sensitive ? $attempt?->ip_address : null,
            has_fingerprint: $attempt?->fingerprint_key !== null,
            review: [
                'label' => $review?->label?->value ?? 'UNKNOWN',
                'reason' => $review?->reason,
                'reviewed_by' => $review?->reviewer?->name,
                'reviewed_at' => $review?->reviewed_at?->toIso8601String(),
            ],
            rules_version: $assessment->rules_version,
            assessed_at: $assessment->assessed_at?->toIso8601String(),
            order_created_at: $order?->created_at?->toIso8601String(),
        );
    }

    public static function phone(?string $phone, bool $sensitive): ?string
    {
        if ($phone === null || $sensitive || strlen($phone) < 6) {
            return $phone;
        }

        return substr($phone, 0, 2) . str_repeat('•', strlen($phone) - 5) . substr($phone, -3);
    }
}
