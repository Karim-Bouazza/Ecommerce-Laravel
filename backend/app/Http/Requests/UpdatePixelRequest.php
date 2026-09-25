<?php

namespace App\Http\Requests;

use App\Models\Pixel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePixelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('pixels.edit');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'provider' => ['required', 'string', Rule::in(Pixel::PROVIDERS)],
            'pixel_id' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }
}
