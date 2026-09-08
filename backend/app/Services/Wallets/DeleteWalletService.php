<?php

namespace App\Services\Wallets;

use App\Models\Wallet;
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
