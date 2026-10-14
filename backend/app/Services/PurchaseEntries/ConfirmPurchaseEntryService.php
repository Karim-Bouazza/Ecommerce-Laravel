<?php

namespace App\Services\PurchaseEntries;

use App\Enums\Purchase\PurchaseEntryStatus;
use App\Enums\Stock\StockMovementType;
use App\Models\Purchasing\PurchaseEntry;
use App\Models\Inventory\Stock;
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
                $current = Stock::lockAndGetInDepot($warehouse->id, $item->product_id);
                $newQuantity = $current + $item->quantity;

                $warehouse->stockMovements()->create([
                    'product_id' => $item->product_id,
                    'type' => StockMovementType::In,
                    'quantity' => $item->quantity,
                    'resulting_quantity' => $newQuantity,
                ]);
            }

            $entry->update([
                'status' => PurchaseEntryStatus::Completed,
                'confirmed_at' => now(),
            ]);
        });
    }
}
