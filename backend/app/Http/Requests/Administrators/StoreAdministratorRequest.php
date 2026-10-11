<?php

namespace App\Http\Requests\Administrators;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreAdministratorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('administrateurs.create');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
