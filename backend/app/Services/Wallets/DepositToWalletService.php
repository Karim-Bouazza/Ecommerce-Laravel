<?php

namespace App\Services\Wallets;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DepositToWalletService
{
    public function execute(Wallet $wallet, array $data): void
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        DB::transaction(function () use ($wallet, $amount, $data) {
            $wallet->transactions()->create([
                'date' => $data['date'],
                'type' => WalletTransactionType::In,
                'category' => WalletTransactionCategory::Deposit,
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $wallet->increment('balance', $amount);
        });
    }
}
