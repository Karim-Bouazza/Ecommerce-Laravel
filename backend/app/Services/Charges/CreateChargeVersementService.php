<?php

namespace App\Services\Charges;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Models\Charge;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateChargeVersementService
{
    public function execute(Charge $charge, array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($charge, $amount, $data): WalletTransaction {
            $charge = Charge::query()->lockForUpdate()->findOrFail($charge->id);

            $remaining = $charge->remainingAmount();

            if ($remaining <= 0) {
                throw new RuntimeException('Cette charge est déjà entièrement payée.');
            }

            if ($amount > $remaining) {
                throw new RuntimeException('Le montant dépasse le restant à payer.');
            }

            $wallet = Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            if ($wallet->balance < $amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$wallet->name} ».");
            }

            $transaction = $wallet->transactions()->create([
                'charge_id' => $charge->id,
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
