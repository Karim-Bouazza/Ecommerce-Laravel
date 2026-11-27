<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Data;

class TokenLoginData extends Data
{
    public function __construct(
        public string $email,
        public string $password,
        public string $device_name,
    ) {}

    public static function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['required', 'string', 'max:255'],
        ];
    }
}
