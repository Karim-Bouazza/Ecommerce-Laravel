<?php

namespace App\Services\Paiements;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DeleteDeliveryPaymentService
{
    public function execute(WalletTransaction $paiement): void
    {
        DB::transaction(function () use ($paiement): void {
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($paiement->wallet_id);

            if ($wallet->balance < $paiement->amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$wallet->name} » pour supprimer ce paiement.");
            }

            $wallet->decrement('balance', $paiement->amount);

            $paiement->delete();
        });
    }
}
