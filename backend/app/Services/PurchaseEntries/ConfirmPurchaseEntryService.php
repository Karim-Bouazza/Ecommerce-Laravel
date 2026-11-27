<?php

namespace App\Services\PurchaseEntries;

use App\States\Purchase\Completed;
use App\Enums\Stock\StockMovementType;
use App\Models\Purchasing\PurchaseEntry;
use App\Services\Warehouses\RecordStockMovementService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConfirmPurchaseEntryService
{
    public function execute(PurchaseEntry $entry): void
    {
        if (! $entry->isPending()) {
            throw new RuntimeException('Cette entrée est déjà confirmée.');
        }

        DB::transaction(function () use ($entry): void {
            $warehouse = $entry->warehouse;

            foreach ($entry->items()->get() as $item) {
                app(RecordStockMovementService::class)->execute(
                    $warehouse,
                    $item->product_id,
                    StockMovementType::In,
                    $item->quantity,
                );
            }

            $entry->confirmed_at = now();
            $entry->status->transitionTo(Completed::class);
        });
    }
}
