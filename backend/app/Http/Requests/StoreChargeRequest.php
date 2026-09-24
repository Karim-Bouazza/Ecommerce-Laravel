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
            'category' => ['required', Rule::in(array_column(ChargeCategory::cases(), 'value'))],
            'type' => ['required', Rule::in(array_column(ChargeType::cases(), 'value'))],
            'order_trigger' => [
                'nullable',
                'required_if:type,per_order',
                Rule::in(array_column(ChargeOrderTrigger::cases(), 'value')),
            ],
            'recurrence_frequency' => [
                'nullable',
                'required_if:type,recurring',
                Rule::in(array_column(ChargeRecurrenceFrequency::cases(), 'value')),
            ],
            'name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'all_products' => ['boolean'],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }
}
