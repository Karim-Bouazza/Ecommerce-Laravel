<?php

namespace App\Services\Paiements;

use App\Models\DeliveryCompanyIntegration;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdateDeliveryPaymentService
{
    public function execute(WalletTransaction $paiement, array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($paiement, $amount, $data): WalletTransaction {
            $paiement = WalletTransaction::query()->lockForUpdate()->findOrFail($paiement->id);
            $partner = DeliveryCompanyIntegration::query()->findOrFail($data['delivery_company_integration_id']);

            $oldWallet = Wallet::query()->lockForUpdate()->findOrFail($paiement->wallet_id);

            if ($oldWallet->balance < $paiement->amount) {
                throw new RuntimeException("Solde insuffisant dans le portefeuille « {$oldWallet->name} » pour modifier ce paiement.");
            }

            $oldWallet->decrement('balance', $paiement->amount);

            $newWallet = $oldWallet->id === (int) $data['wallet_id']
                ? $oldWallet->fresh()
                : Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            $paiement->update([
                'wallet_id' => $newWallet->id,
                'delivery_company_integration_id' => $partner->id,
                'date' => $data['date'],
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $newWallet->increment('balance', $amount);

            return $paiement;
        });
    }
}
