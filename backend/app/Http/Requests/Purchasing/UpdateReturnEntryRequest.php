<?php

namespace App\Http\Requests\Purchasing;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReturnEntryRequest extends FormRequest
{
    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.purchase_entry_item_id' => ['required', 'integer', 'exists:purchase_entry_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
