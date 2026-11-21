<?php

namespace App\Data\Finance;

use Spatie\LaravelData\Data;

class WalletTransferData extends Data
{
    public function __construct(
        public string $date,
        public int $from_wallet_id,
        public int $to_wallet_id,
        public int|float $amount,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'from_wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'to_wallet_id' => ['required', 'integer', 'exists:wallets,id', 'different:from_wallet_id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
