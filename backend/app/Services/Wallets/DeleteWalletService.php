<?php

namespace App\Services\Wallets;

use App\Models\Wallet;
use RuntimeException;

class DeleteWalletService
{
    public function execute(Wallet $wallet): void
    {
        $wallet->delete();
    }
}
