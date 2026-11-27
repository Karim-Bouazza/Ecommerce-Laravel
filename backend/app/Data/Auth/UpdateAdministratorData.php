<?php

namespace App\Data\Auth;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateAdministratorData extends Data
{
    public function __construct(
        public string|Optional $name = new Optional(),
        public string|Optional $email = new Optional(),
        public int|Optional $role_id = new Optional(),
        public string|null|Optional $phone = new Optional(),
        public string|null|Optional $password = new Optional(),
        public bool|Optional $is_active = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email:rfc',
                'max:255',
                Rule::unique('users', 'email')->ignore(request()->route('administrator')),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_id' => ['sometimes', 'required', 'integer', 'exists:roles,id'],
            'password' => ['nullable', 'string', Password::min(8), 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
