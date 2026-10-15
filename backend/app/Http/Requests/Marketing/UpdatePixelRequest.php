<?php

namespace App\Http\Requests\Marketing;

use App\Models\Marketing\Pixel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePixelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('pixels.edit');
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('pixel_id'))) {
            $this->merge(['pixel_id' => trim($this->input('pixel_id'))]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'provider' => ['required', 'string', Rule::in(Pixel::PROVIDERS)],
            'pixel_id' => ['required', 'string', 'regex:/^\d{10,20}$/'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pixel_id.regex' => "L'ID du pixel Meta doit contenir uniquement des chiffres (10 à 20).",
        ];
    }
}
