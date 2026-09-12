<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('clients.edit');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('clients', 'phone_number')->ignore($this->route('client')),
            ],
            'wilaya_id' => ['required', 'integer', 'exists:wilayas,id'],
            'commune_id' => [
                'required',
                'integer',
                Rule::exists('communes', 'id')->where('wilaya_id', $this->input('wilaya_id')),
            ],
        ];
    }
}
