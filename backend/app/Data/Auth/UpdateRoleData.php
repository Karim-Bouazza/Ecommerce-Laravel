<?php

namespace App\Data\Auth;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateRoleData extends Data
{
    /**
     * @param  array<int, string>|Optional  $permissions
     */
    public function __construct(
        public string|Optional $name,
        public array|Optional $permissions,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string'],
        ];
    }
}
