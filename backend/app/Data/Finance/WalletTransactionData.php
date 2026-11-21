<?php

namespace App\Data\Finance;

use App\Models\Finance\WalletTransaction;
use Spatie\LaravelData\Data;

class WalletTransactionData extends Data
{
    public function __construct(
        public int $id,
        public mixed $reference,
        public ?string $date,
        public ?string $creator_name,
        public int $amount,
        public ?string $remark,
        public string $category,
        public string $category_label,
        public string $category_color,
    ) {}

    public static function fromTransaction(WalletTransaction $transaction): self
    {
        return new self(
            id: $transaction->id,
            reference: $transaction->reference,
            date: $transaction->date?->format('Y-m-d'),
            creator_name: $transaction->creator?->name,
            amount: (int) $transaction->amount,
            remark: $transaction->remark,
            category: $transaction->category->value,
            category_label: $transaction->category->label(),
            category_color: $transaction->category->color(),
        );
    }
}
