<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class IndexAdministratorData extends Data
{
    public function __construct(
        public string|null|Optional $search = new Optional(),
        public int|null|Optional $role_id = new Optional(),
        public string|null|Optional $status = new Optional(),
        public int|null|Optional $per_page = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'role_id' => ['nullable', 'integer', 'exists:roles,id'],
            'status' => ['nullable', 'in:active,inactive'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
