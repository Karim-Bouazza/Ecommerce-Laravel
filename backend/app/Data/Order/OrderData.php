<?php

namespace App\Data\Order;

use App\Enums\Fraud\FraudReviewLabel;
use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use Spatie\LaravelData\Data;

class OrderData extends Data
{
    public function __construct(
        public int $id,
        public string $reference,
        public ?string $ip_address,
        public string $status,
        public string $status_color,
        public bool $is_editable,
        public bool $can_ship,
        public bool $can_delete,
        public array $status_transitions,
        public string $payment_status,
        public string $payment_status_label,
        public string $type,
        public string $type_label,
        public string $delivery_type,
        public string $delivery_type_label,
        public ?int $stop_desk_company_id,
        public ?string $stop_desk_company_name,
        public ?int $client_id,
        public ?string $first_name,
        public ?string $last_name,
        public string $client_name,
        public ?string $phone_number,
        public ?int $wilaya_id,
        public ?string $wilaya_name,
        public ?int $commune_id,
        public ?string $commune_name,
        public ?string $address,
        public mixed $provider_wilaya_id,
        public mixed $provider_commune_id,
        public mixed $provider_office_id,
        public ?string $delivery_note,
        public ?string $name,
        public ?string $provider_order_id,
        public bool $free_delivery,
        public bool $can_be_opened,
        public int $subtotal,
        public int $delivery_price,
        public int $total_price,
        public ?string $scheduled_at,
        public ?string $date_report,
        public ?string $created_at,
        public ?string $status_changed_at,
        public ?array $fraud_risk,
        public array $items,
    ) {}

    public static function fromOrder(Order $order, bool $canViewFraud = false): self
    {
        return new self(
            id: $order->id,
            reference: $order->reference,
            ip_address: $order->ip_address,
            status: $order->status->label(),
            status_color: $order->status->color(),
            is_editable: $order->status->isEditable(),
            can_ship: $order->status === OrderStatus::Assigned,
            can_delete: $order->status->canBeDeleted(),
            status_transitions: collect($order->status->allowedTransitions())
                ->reject(fn (OrderStatus $status) => $status === OrderStatus::Scheduled)
                ->map(fn (OrderStatus $status) => ['value' => $status->value, 'label' => $status->label()])
                ->values()
                ->all(),
            payment_status: $order->payment_status->value,
            payment_status_label: $order->payment_status->label(),
            type: $order->type->value,
            type_label: $order->type->label(),
            delivery_type: $order->delivery_type->value,
            delivery_type_label: $order->delivery_type->label(),
            stop_desk_company_id: $order->stop_desk_company_id,
            stop_desk_company_name: $order->stopDeskCompany?->name,
            client_id: $order->client_id,
            first_name: $order->client?->first_name,
            last_name: $order->client?->last_name,
            client_name: trim(($order->client?->first_name ?? '') . ' ' . ($order->client?->last_name ?? '')),
            phone_number: $order->client?->phone_number,
            wilaya_id: $order->client?->wilaya_id,
            wilaya_name: $order->client?->wilaya?->name,
            commune_id: $order->client?->commune_id,
            commune_name: $order->client?->commune?->name,
            address: $order->address,
            provider_wilaya_id: $order->provider_wilaya_id,
            provider_commune_id: $order->provider_commune_id,
            provider_office_id: $order->provider_office_id,
            delivery_note: $order->delivery_note,
            name: $order->name,
            provider_order_id: $order->provider_order_id,
            free_delivery: (bool) $order->free_delivery,
            can_be_opened: (bool) $order->can_be_opened,
            subtotal: (int) $order->subtotal,
            delivery_price: (int) $order->delivery_price,
            total_price: (int) $order->total_price,
            scheduled_at: $order->scheduled_at?->toIso8601String(),
            date_report: $order->date_report?->toIso8601String(),
            created_at: $order->created_at?->toIso8601String(),
            status_changed_at: ($order->latestStatusHistory?->created_at ?? $order->created_at)?->toIso8601String(),
            fraud_risk: $canViewFraud ? self::fraudRisk($order) : null,
            items: $order->items->map(fn ($item) => OrderItemData::fromItem($item))->values()->all(),
        );
    }

    private static function fraudRisk(Order $order): ?array
    {
        $assessment = $order->fraudAssessment;

        if ($assessment === null) {
            return null;
        }

        return [
            'score' => (int) $assessment->score,
            'level' => $assessment->risk_level->value,
            'review_label' => ($order->fraudReview?->label ?? FraudReviewLabel::Unknown)->value,
        ];
    }
}
