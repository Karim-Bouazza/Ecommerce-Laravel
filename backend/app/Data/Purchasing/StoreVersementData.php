<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Data;

class StoreVersementData extends Data
{
    public function __construct(
        public string $date,
        public int $wallet_id,
        public int|float $amount,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
