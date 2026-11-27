<?php

namespace App\Services\ReturnEntries;

use App\States\Return\Completed;
use App\Enums\Stock\StockMovementType;
use App\Models\Purchasing\ReturnEntry;
use App\Services\Warehouses\RecordStockMovementService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConfirmReturnEntryService
{
    public function execute(ReturnEntry $entry): void
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
                    StockMovementType::Out,
                    $item->quantity,
                );
            }

            $entry->confirmed_at = now();
            $entry->status->transitionTo(Completed::class);
        });
    }
}
