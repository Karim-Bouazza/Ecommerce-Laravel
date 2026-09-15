<?php

namespace App\Services\ReturnEntries;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Models\ReturnEntry;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateReturnEntryVersementService
{
    public function execute(ReturnEntry $entry, array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($entry, $amount, $data): WalletTransaction {
            $entry = ReturnEntry::query()->lockForUpdate()->findOrFail($entry->id);

            $remaining = $entry->remainingAmount();

            if ($remaining <= 0) {
                throw new RuntimeException('Ce retour est déjà entièrement payé.');
            }

            if ($amount !== $remaining) {
                throw new RuntimeException("Le paiement doit correspondre au montant restant ({$remaining} DZD). Les paiements partiels ne sont pas autorisés.");
            }

            $wallet = Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            $transaction = $wallet->transactions()->create([
                'return_entry_id' => $entry->id,
                'date' => $data['date'],
                'type' => WalletTransactionType::In,
                'category' => WalletTransactionCategory::Deposit,
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $wallet->increment('balance', $amount);

            return $transaction;
        });
    }
}
