<?php

namespace App\Services\Paiements;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use App\Models\DeliveryCompanyIntegration;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateDeliveryPaymentService
{
    public function execute(array $data): WalletTransaction
    {
        $amount = (int) $data['amount'];

        if ($amount <= 0) {
            throw new RuntimeException('Le montant doit être supérieur à 0.');
        }

        return DB::transaction(function () use ($amount, $data): WalletTransaction {
            $partner = DeliveryCompanyIntegration::query()->findOrFail($data['delivery_company_integration_id']);
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($data['wallet_id']);

            $transaction = $wallet->transactions()->create([
                'delivery_company_integration_id' => $partner->id,
                'date' => $data['date'],
                'type' => WalletTransactionType::In,
                'category' => WalletTransactionCategory::Payment,
                'amount' => $amount,
                'remark' => $data['remark'] ?? null,
            ]);

            $wallet->increment('balance', $amount);

            return $transaction;
        });
    }
}
