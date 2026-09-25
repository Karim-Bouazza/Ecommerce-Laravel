<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWilayaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('wilayas.edit');
    }

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
