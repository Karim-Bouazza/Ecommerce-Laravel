<?php

namespace App\Http\Resources\Fraud;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Fraud\FraudAssessment */
class FraudAssessmentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $sensitive = (bool) $request->user()?->hasPermission('fraud.view_sensitive');
        $order = $this->order;
        $attempt = $this->attempt;
        $review = $order?->fraudReview;
        $confirmedFakeMatches = collect($this->historical ?? [])
            ->filter(fn ($m) => ($m['orders'] ?? 0) > 0)
            ->map(fn ($m) => $m['orders'])
            ->all();

        return [
            'order_id' => $this->order_id,
            'order_reference' => $order?->reference,
            'order_status' => $order?->status?->value,
            'order_status_label' => $order?->status?->label(),
            'customer_name' => $order?->client ? trim($order->client->first_name.' '.$order->client->last_name) : null,
            'customer_phone' => self::phone($order?->client?->phone_number, $sensitive),
            'score' => $this->score,
            'risk_level' => $this->risk_level->value,
            'recommended_action' => $this->recommended_action,
            'daily_points' => $this->daily_points,
            'historical_points' => $this->historical_points,
            'outcome_points' => $this->outcome_points,
            'excluded_ip_points' => $this->excluded_ip_points,
            'counts' => $this->counts,
            'confirmed_fake_matches' => $confirmedFakeMatches,
            'browser' => $attempt ? trim(($attempt->browser_name ?? '').' '.($attempt->browser_version ?? '')) ?: null : null,
            'os' => $attempt ? trim(($attempt->os_name ?? '').' '.($attempt->os_version ?? '')) ?: null : null,
            'device_category' => $attempt?->device_category,
            'ip_address' => $sensitive ? $attempt?->ip_address : null,
            'has_fingerprint' => $attempt?->fingerprint_key !== null,
            'review' => [
                'label' => $review?->label?->value ?? 'UNKNOWN',
                'reason' => $review?->reason,
                'reviewed_by' => $review?->reviewer?->name,
                'reviewed_at' => $review?->reviewed_at?->toIso8601String(),
            ],
            'rules_version' => $this->rules_version,
            'assessed_at' => $this->assessed_at?->toIso8601String(),
            'order_created_at' => $order?->created_at?->toIso8601String(),
        ];
    }

    public static function phone(?string $phone, bool $sensitive): ?string
    {
        if ($phone === null || $sensitive || strlen($phone) < 6) {
            return $phone;
        }

        return substr($phone, 0, 2).str_repeat('•', strlen($phone) - 5).substr($phone, -3);
    }
}
