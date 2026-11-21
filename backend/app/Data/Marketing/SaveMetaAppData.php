<?php

namespace App\Data\Marketing;

use Spatie\LaravelData\Data;

class SaveMetaAppData extends Data
{
    public function __construct(
        public string $app_id,
        public ?string $app_secret = null,
    ) {}

    public static function rules(): array
    {
        return [
            'app_id' => ['required', 'string', 'max:50'],
            'app_secret' => ['nullable', 'string', 'max:255'],
        ];
    }
}
