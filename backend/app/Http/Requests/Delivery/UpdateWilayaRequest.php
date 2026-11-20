<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWilayaRequest extends FormRequest
{
    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'price_domicile' => ['sometimes', 'integer', 'min:0'],
            'price_stop_desk' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
