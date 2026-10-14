<?php

namespace App\Services\Versements;

use App\Enums\Wallet\WalletTransactionCategory;
use App\Enums\Wallet\WalletTransactionType;
use App\Models\Purchasing\Fournisseur;
use App\Models\Finance\Wallet;
use App\Models\Finance\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateFournisseurVersementService
{
    public function execute(array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($amount, $data): WalletTransaction {
            $fournisseur = Fournisseur::query()->findOrFail($data['fournisseur_id']);
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            if ($wallet->balance < $amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$wallet->name} ».");
            }

            $transaction = $wallet->transactions()->create([
                'fournisseur_id' => $fournisseur->id,
                'date' => $data['date'],
                'type' => WalletTransactionType::Out,
                'category' => WalletTransactionCategory::Versement,
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $wallet->decrement('balance', $amount);

            return $transaction;
        });
    }
}
