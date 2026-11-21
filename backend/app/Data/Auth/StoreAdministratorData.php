<?php

namespace App\Data\Auth;

use Illuminate\Validation\Rules\Password;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class StoreAdministratorData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public int $role_id,
        public string $password,
        public string|null|Optional $phone = new Optional(),
        public bool|Optional $is_active = new Optional(),
    ) {}

    public static function rules(): array
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
