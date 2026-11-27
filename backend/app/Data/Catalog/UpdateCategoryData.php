<?php

namespace App\Data\Catalog;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateCategoryData extends Data
{
    public function __construct(
        public string|Optional $name = new Optional(),
        public bool|Optional $is_active = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
