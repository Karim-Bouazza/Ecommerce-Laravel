<?php

namespace App\Data\Marketing;

use Spatie\LaravelData\Data;

class MetaSpendData extends Data
{
    public function __construct(
        public string $date_from,
        public string $date_to,
        public bool $fresh = false,
    ) {}

    public static function rules(): array
    {
        return [
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'fresh' => ['sometimes', 'boolean'],
        ];
    }
}
