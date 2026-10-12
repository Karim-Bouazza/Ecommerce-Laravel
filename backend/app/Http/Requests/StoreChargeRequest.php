<?php

namespace App\Http\Requests;

use App\Enums\ChargeCategory;
use App\Enums\ChargeOrderTrigger;
use App\Enums\ChargeRecurrenceFrequency;
use App\Enums\ChargeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChargeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('charges.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
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
            'product_ids' => ['array', Rule::requiredIf(! $this->boolean('all_products')), 'min:1'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_ids.required' => 'Choisissez au moins un produit, ou appliquez la charge à tous les produits.',
            'product_ids.min' => 'Choisissez au moins un produit, ou appliquez la charge à tous les produits.',
        ];
    }

    /**
     * Validated data keeping only the fields that make sense for the charge type.
     *
     * @return array<string, mixed>
     */
    public function chargeData(): array
    {
        $data = $this->validated();
        $type = ChargeType::from($data['type']);
        $allProducts = (bool) ($data['all_products'] ?? false);

        return [
            'category' => $data['category'],
            'type' => $type,
            'order_trigger' => $type === ChargeType::PerOrder ? $data['order_trigger'] : null,
            'recurrence_frequency' => $type === ChargeType::Recurring ? $data['recurrence_frequency'] : null,
            'name' => $data['name'],
            'amount' => $data['amount'],
            'all_products' => $allProducts,
            'product_ids' => $allProducts ? [] : $data['product_ids'],
            'starts_at' => $data['starts_at'] ?? null,
            'ends_at' => $type === ChargeType::Normal ? null : ($data['ends_at'] ?? null),
        ];
    }
}
