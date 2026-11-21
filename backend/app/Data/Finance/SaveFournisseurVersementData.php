<?php

namespace App\Data\Finance;

use Spatie\LaravelData\Data;

class SaveFournisseurVersementData extends Data
{
    public function __construct(
        public string $date,
        public int $wallet_id,
        public int $fournisseur_id,
        public int|float $amount,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'wallet_id' => ['required', 'integer', 'exists:wallets,id'],
            'fournisseur_id' => ['required', 'integer', 'exists:fournisseurs,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'remark' => ['nullable', 'string', 'max:255'],
        ];
    }
}
