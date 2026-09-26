<?php

namespace App\Http\Requests;

use App\Enums\DeliveryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CalculatePackagePriceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('orders.create') || $this->user()->hasPermission('orders.edit');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'price' => ['required', 'integer', 'min:0'],
            'provider_wilaya_id' => ['required', 'integer'],
            'provider_commune_id' => ['nullable', 'integer'],
            'delivery_type' => ['required', Rule::in(array_column(DeliveryType::cases(), 'value'))],
            'provider_office_id' => [
                'nullable',
                'string',
                Rule::requiredIf(fn () => $this->input('delivery_type') === DeliveryType::PointRelais->value),
            ],
            'free_delivery' => ['nullable', 'boolean'],
            'can_be_opened' => ['nullable', 'boolean'],
        ];
    }
}
