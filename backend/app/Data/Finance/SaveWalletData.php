<?php

namespace App\Data\Finance;

use Spatie\LaravelData\Data;

class SaveWalletData extends Data
{
    public function __construct(
        public string $name,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
