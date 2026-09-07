<?php

namespace App\Services\Wallets;

use App\Models\Wallet;
use RuntimeException;

class DeleteWalletService
{
    public function execute(Wallet $wallet): void
    {
        if ($wallet->balance !== 0) {
            throw new RuntimeException('Impossible de supprimer un portefeuille dont le solde n\'est pas nul.');
        }

        if ($wallet->transactions()->exists()) {
            throw new RuntimeException('Impossible de supprimer un portefeuille ayant des transactions.');
        }

        $wallet->delete();
    }
}
