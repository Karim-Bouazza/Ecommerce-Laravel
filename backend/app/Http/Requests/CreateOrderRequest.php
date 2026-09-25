<?php

namespace App\Http\Requests;

use App\Enums\DeliveryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required'],

            'last_name' => ['required'],

            'phone_number' => ['required'],

            'wilaya_id' => ['required', 'exists:wilayas,id'],

            'commune_id' => ['nullable', 'exists:communes,id'],

            'provider_wilaya_id' => ['nullable', 'integer'],

            'provider_commune_id' => ['nullable', 'integer'],

            'delivery_type' => ['nullable', Rule::in(array_column(DeliveryType::cases(), 'value'))],

            'delivery_price' => ['nullable', 'integer', 'min:0'],

            'note' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => ['required', 'exists:products,id'],

            'items.*.variant' => ['nullable', 'string', 'max:255'],

            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
