<?php

namespace App\Services\Wallets;

use App\Models\Wallet;

class CreateWalletService
{
    public function execute(array $data): Wallet
    {
        return Wallet::create([
            'name' => $data['name'],
            'remark' => $data['remark'] ?? null,
            'balance' => 0,
        ]);
    }
}
