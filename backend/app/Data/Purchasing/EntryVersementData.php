<?php

namespace App\Data\Purchasing;

use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\Data;

class EntryVersementData extends Data
{
    public function __construct(
        public int $id,
        public mixed $reference,
        public ?string $date,
        public int $amount,
        public mixed $wallet_id,
        public ?string $wallet_name,
        public ?string $remark,
    ) {}

    public static function fromVersement(Model $versement): self
    {
        return new self(
            id: $versement->id,
            reference: $versement->reference,
            date: $versement->date?->format('Y-m-d'),
            amount: (int) $versement->amount,
            wallet_id: $versement->wallet_id,
            wallet_name: $versement->wallet?->name,
            remark: $versement->remark,
        );
    }
}
