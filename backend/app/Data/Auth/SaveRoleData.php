<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Data;

class SaveRoleData extends Data
{
    public function __construct(
        public string $name,
        public array $permissions = [],
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'permissions' => ['array'],
            'permissions.*' => ['string'],
        ];
    }
}
