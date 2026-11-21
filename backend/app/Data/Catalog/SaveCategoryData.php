<?php

namespace App\Data\Catalog;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SaveCategoryData extends Data
{
    public function __construct(
        public string $name,
        public bool|Optional $is_active = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }
}
