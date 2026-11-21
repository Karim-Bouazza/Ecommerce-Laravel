<?php

namespace App\Data\Finance;

use App\Models\Finance\WalletTransaction;
use Spatie\LaravelData\Data;

class VersementData extends Data
{
    public function __construct(
        public int $id,
        public mixed $reference,
        public ?string $date,
        public ?string $creator_name,
        public mixed $wallet_id,
        public ?string $wallet_name,
        public int $amount,
        public ?string $remark,
        public string $type,
        public string $type_label,
        public mixed $fournisseur_id,
        public ?string $fournisseur_name,
    ) {}

    public static function fromTransaction(WalletTransaction $transaction): self
    {
        return new self(
            id: $transaction->id,
            reference: $transaction->reference,
            date: $transaction->date?->format('Y-m-d'),
            creator_name: $transaction->creator?->name,
            wallet_id: $transaction->wallet_id,
            wallet_name: $transaction->wallet?->name,
            amount: (int) $transaction->amount,
            remark: $transaction->remark,
            type: 'fournisseur',
            type_label: 'Fournisseur de produits',
            fournisseur_id: $transaction->fournisseur_id,
            fournisseur_name: $transaction->fournisseur?->name,
        );
    }
}
