<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('entrepots.edit');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'remark' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'all_wilayas' => ['boolean'],
            'all_products' => ['boolean'],
            'wilaya_ids' => ['array'],
            'wilaya_ids.*' => ['integer', 'exists:wilayas,id'],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }
}
