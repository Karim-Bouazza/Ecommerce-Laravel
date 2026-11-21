<?php

namespace App\Data\Finance;

use App\Enums\Charge\ChargeCategory;
use App\Enums\Charge\ChargeOrderTrigger;
use App\Enums\Charge\ChargeRecurrenceFrequency;
use App\Enums\Charge\ChargeType;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class SaveChargeData extends Data
{
    public function __construct(
        public ChargeCategory $category,
        public ChargeType $type,
        public string $name,
        public int $amount,
        public ?ChargeOrderTrigger $order_trigger = null,
        public ?ChargeRecurrenceFrequency $recurrence_frequency = null,
        public ?string $starts_at = null,
        public ?string $ends_at = null,
        public bool $all_products = false,
        public array $product_ids = [],
    ) {}

    public static function rules(ValidationContext $context): array
    {
        $allProducts = filter_var($context->payload['all_products'] ?? false, FILTER_VALIDATE_BOOLEAN);

        return [
            'category' => ['required', Rule::enum(ChargeCategory::class)],
            'type' => ['required', Rule::enum(ChargeType::class)],
            'order_trigger' => ['nullable', 'required_if:type,per_order', Rule::enum(ChargeOrderTrigger::class)],
            'recurrence_frequency' => ['nullable', 'required_if:type,recurring', Rule::enum(ChargeRecurrenceFrequency::class)],
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'all_products' => ['boolean'],
            'product_ids' => ['array', Rule::requiredIf(! $allProducts), 'min:1'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }

    public static function messages(): array
    {
        return [
            'product_ids.required' => 'Choisissez au moins un produit, ou appliquez la charge à tous les produits.',
            'product_ids.min' => 'Choisissez au moins un produit, ou appliquez la charge à tous les produits.',
        ];
    }

    public function chargeAttributes(): array
    {
        return [
            'category' => $this->category,
            'type' => $this->type,
            'order_trigger' => $this->type === ChargeType::PerOrder ? $this->order_trigger : null,
            'recurrence_frequency' => $this->type === ChargeType::Recurring ? $this->recurrence_frequency : null,
            'name' => $this->name,
            'amount' => $this->amount,
            'all_products' => $this->all_products,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->type === ChargeType::Normal ? null : $this->ends_at,
        ];
    }

    public function productIds(): array
    {
        return $this->all_products ? [] : $this->product_ids;
    }
}
