<?php

namespace App\Services\Wallets;

use App\Enums\Wallet\WalletTransactionCategory;
use App\Enums\Wallet\WalletTransactionType;
use App\Models\Finance\Wallet;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class WithdrawFromWalletService
{
    public function execute(Wallet $wallet, array $data): void
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        DB::transaction(function () use ($wallet, $amount, $data) {
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($wallet->id);

            if ($wallet->balance < $amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$wallet->name} ».");
            }

            $wallet->transactions()->create([
                'date' => $data['date'],
                'type' => WalletTransactionType::Out,
                'category' => WalletTransactionCategory::Withdrawal,
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $wallet->decrement('balance', $amount);
        });
    }
}
