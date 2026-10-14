<?php

namespace App\Services\Wallets;

use App\Models\Finance\Wallet;
use Illuminate\Support\Facades\DB;

class DeleteWalletService
{
    public function execute(Wallet $wallet): void
    {
        DB::transaction(function () use ($wallet): void {
            $wallet->transactions()->delete();
            $wallet->delete();
        });
    }
}
