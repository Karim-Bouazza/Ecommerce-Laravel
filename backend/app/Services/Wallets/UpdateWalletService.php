<?php

namespace App\Services\Wallets;

use App\Data\Finance\SaveWalletData;
use App\Models\Finance\Wallet;

class UpdateWalletService
{
    public function execute(Wallet $wallet, SaveWalletData $data): Wallet
    {
        $wallet->update([
            'name' => $data->name,
            'remark' => $data->remark,
        ]);

        return $wallet;
    }
}
