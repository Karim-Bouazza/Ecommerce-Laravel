<?php

namespace App\Services\Wallets;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Models\Wallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class TransferBetweenWalletsService
{
    public function execute(array $data): void
    {
        $fromWalletId = $data['from_wallet_id'];
        $toWalletId = $data['to_wallet_id'];
        $amount = (int) $data['amount'];

        if ($fromWalletId === $toWalletId) {
            throw new RuntimeException('Le portefeuille source et destination doivent être différents.');
        }

        if ($amount <= 0) {
            throw new RuntimeException('Le montant du transfert doit être supérieur à 0.');
        }

        DB::transaction(function () use ($fromWalletId, $toWalletId, $amount, $data) {
            $fromWallet = Wallet::query()->lockForUpdate()->findOrFail($fromWalletId);
            $toWallet = Wallet::query()->lockForUpdate()->findOrFail($toWalletId);

            if ($fromWallet->balance < $amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$fromWallet->name} ».");
            }

            $transferGroupId = (string) Str::uuid();
            $userRemark = $data['remark'] ?? null;

            $outRemark = "Transfer to wallet: {$toWallet->name}.";
            $inRemark = "Transfer from wallet: {$fromWallet->name}.";

            if (filled($userRemark)) {
                $outRemark .= " {$userRemark}";
                $inRemark .= " {$userRemark}";
            }

            $fromWallet->transactions()->create([
                'date' => $data['date'],
                'type' => WalletTransactionType::Out,
                'category' => WalletTransactionCategory::Withdrawal,
                'amount' => $amount,
                'remark' => $outRemark,
                'transfer_group_id' => $transferGroupId,
            ]);

            $toWallet->transactions()->create([
                'date' => $data['date'],
                'type' => WalletTransactionType::In,
                'category' => WalletTransactionCategory::Deposit,
                'amount' => $amount,
                'remark' => $inRemark,
                'transfer_group_id' => $transferGroupId,
            ]);

            $fromWallet->decrement('balance', $amount);
            $toWallet->increment('balance', $amount);
        });
    }
}
