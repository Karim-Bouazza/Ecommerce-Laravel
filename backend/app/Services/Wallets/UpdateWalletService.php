<?php

namespace App\Services\Wallets;

use App\Models\Wallet;

class UpdateWalletService
{
    public function execute(Wallet $wallet, array $data): Wallet
    {
        $wallet->update([
            'name' => $data['name'],
            'remark' => $data['remark'] ?? null,
        ]);

        return $wallet;
    }
}
