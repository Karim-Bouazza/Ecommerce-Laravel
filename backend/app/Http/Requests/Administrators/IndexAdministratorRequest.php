<?php

namespace App\Http\Requests\Administrators;

use Illuminate\Foundation\Http\FormRequest;

class IndexAdministratorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('administrateurs.view');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'role_id' => ['nullable', 'integer', 'exists:roles,id'],
            'status' => ['nullable', 'in:active,inactive'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
