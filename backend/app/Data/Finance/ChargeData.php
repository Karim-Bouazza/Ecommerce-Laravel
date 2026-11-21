<?php

namespace App\Data\Finance;

use App\Models\Finance\Charge;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;

class ChargeData extends Data
{
    public function __construct(
        public int $id,
        public string $category,
        public string $category_label,
        public string $type,
        public string $type_label,
        public ?string $order_trigger,
        public ?string $order_trigger_label,
        public ?string $recurrence_frequency,
        public ?string $recurrence_frequency_label,
        public string $name,
        public mixed $amount,
        public ?string $starts_at,
        public ?string $ends_at,
        public bool $is_active,
        public bool $all_products,
        public array $product_ids,
        public array $product_names,
        public mixed $due_amount,
        public mixed $paid_amount,
        public mixed $remaining_amount,
        public string $payment_status,
        public string $payment_status_label,
        public string $payment_status_color,
        public ?CarbonInterface $created_at,
    ) {}

    public static function fromCharge(Charge $charge): self
    {
        $paymentStatus = $charge->paymentStatus();

        return new self(
            id: $charge->id,
            category: $charge->category->value,
            category_label: $charge->category->label(),
            type: $charge->type->value,
            type_label: $charge->type->label(),
            order_trigger: $charge->order_trigger?->value,
            order_trigger_label: $charge->order_trigger?->label(),
            recurrence_frequency: $charge->recurrence_frequency?->value,
            recurrence_frequency_label: $charge->recurrence_frequency?->label(),
            name: $charge->name,
            amount: $charge->amount,
            starts_at: $charge->starts_at?->format('Y-m-d'),
            ends_at: $charge->ends_at?->format('Y-m-d'),
            is_active: (bool) $charge->is_active,
            all_products: (bool) $charge->all_products,
            product_ids: $charge->products->pluck('id')->values()->all(),
            product_names: $charge->products->pluck('name')->values()->all(),
            due_amount: $charge->dueAmount(),
            paid_amount: $charge->paidAmount(),
            remaining_amount: $charge->remainingAmount(),
            payment_status: $paymentStatus->value,
            payment_status_label: $paymentStatus->label(),
            payment_status_color: $paymentStatus->color(),
            created_at: $charge->created_at,
        );
    }
}
