<?php

namespace App\Data\Finance;

use Spatie\LaravelData\Data;

class WalletMovementData extends Data
{
    public function __construct(
        public string $date,
        public int|float $amount,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
