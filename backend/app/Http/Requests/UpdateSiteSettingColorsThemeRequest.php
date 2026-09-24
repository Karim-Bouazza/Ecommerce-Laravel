<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingColorsThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $hex = ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'];

        return [
            'primary_color' => $hex,
            'primary_dark_color' => $hex,
            'primary_mid_color' => $hex,
            'accent_color' => $hex,
            'accent_light_color' => $hex,
            'contrast_color' => $hex,
        ];
    }
}
