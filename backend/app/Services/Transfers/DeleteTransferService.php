<?php

namespace App\Services\Transfers;

use App\Models\WarehouseTransfer;
use RuntimeException;

class DeleteTransferService
{
    public function execute(WarehouseTransfer $transfer): void
    {
        if (! $transfer->isPending()) {
            throw new RuntimeException('Un transfert confirmé ne peut pas être supprimé.');
        }

        $transfer->delete();
    }
}
