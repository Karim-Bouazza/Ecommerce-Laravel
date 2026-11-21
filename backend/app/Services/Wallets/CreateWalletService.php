<?php

namespace App\Services\Wallets;

use App\Data\Finance\SaveWalletData;
use App\Models\Finance\Wallet;

class CreateWalletService
{
    public function execute(SaveWalletData $data): Wallet
    {
        return Wallet::create([
            'name' => $data->name,
            'remark' => $data->remark,
            'balance' => 0,
        ]);
    }
}
