<?php

namespace App\Services\Versements;

use App\Models\Fournisseur;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdateFournisseurVersementService
{
    public function execute(WalletTransaction $versement, array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($versement, $amount, $data): WalletTransaction {
            $versement = WalletTransaction::query()->lockForUpdate()->findOrFail($versement->id);
            $fournisseur = Fournisseur::query()->findOrFail($data['fournisseur_id']);

            $oldWallet = Wallet::query()->lockForUpdate()->findOrFail($versement->wallet_id);
            $oldWallet->increment('balance', $versement->amount);

            $newWallet = $oldWallet->id === (int) $data['wallet_id']
                ? $oldWallet->fresh()
                : Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            if ($newWallet->balance < $amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$newWallet->name} ».");
            }

            $versement->update([
                'wallet_id' => $newWallet->id,
                'fournisseur_id' => $fournisseur->id,
                'date' => $data['date'],
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $newWallet->decrement('balance', $amount);

            return $versement;
        });
    }
}
