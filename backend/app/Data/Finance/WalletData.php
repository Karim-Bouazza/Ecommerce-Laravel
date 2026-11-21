<?php

namespace App\Data\Finance;

use App\Models\Finance\Wallet;
use Spatie\LaravelData\Data;

class WalletData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public int $balance,
        public int $entries_sum_amount,
        public int $exits_sum_amount,
        public ?string $remark,
    ) {}

    public static function fromWallet(Wallet $wallet): self
    {
        return new self(
            id: $wallet->id,
            name: $wallet->name,
            balance: (int) $wallet->balance,
            entries_sum_amount: (int) ($wallet->entries_sum_amount ?? 0),
            exits_sum_amount: (int) ($wallet->exits_sum_amount ?? 0),
            remark: $wallet->remark,
        );
    }
}
