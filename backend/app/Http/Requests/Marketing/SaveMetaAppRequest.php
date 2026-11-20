<?php

namespace App\Http\Requests\Marketing;

use Illuminate\Foundation\Http\FormRequest;

class SaveMetaAppRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'app_id' => ['required', 'string', 'max:50'],
            'app_secret' => ['nullable', 'string', 'max:255'],
        ];
    }
}
