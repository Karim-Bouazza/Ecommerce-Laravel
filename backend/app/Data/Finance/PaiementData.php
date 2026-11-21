<?php

namespace App\Data\Finance;

use App\Models\Finance\WalletTransaction;
use Spatie\LaravelData\Data;

class PaiementData extends Data
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
        public mixed $delivery_company_integration_id,
        public ?string $delivery_partner_name,
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
            delivery_company_integration_id: $transaction->delivery_company_integration_id,
            delivery_partner_name: $transaction->deliveryCompanyIntegration?->name,
        );
    }
}
