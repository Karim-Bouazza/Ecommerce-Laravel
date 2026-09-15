<?php

namespace App\Services\Versements;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;

class DeleteFournisseurVersementService
{
    public function execute(WalletTransaction $versement): void
    {
        DB::transaction(function () use ($versement): void {
            $wallet = Wallet::query()->lockForUpdate()->findOrFail($versement->wallet_id);

            $wallet->increment('balance', $versement->amount);

            $versement->delete();
        });
    }
}
