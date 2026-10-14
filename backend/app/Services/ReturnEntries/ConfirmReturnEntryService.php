<?php

namespace App\Services\ReturnEntries;

use App\Enums\Return\ReturnEntryStatus;
use App\Enums\Stock\StockMovementType;
use App\Models\Purchasing\ReturnEntry;
use App\Models\Inventory\Stock;
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
                $current = Stock::lockAndGetInDepot($warehouse->id, $item->product_id);
                $newQuantity = max(0, $current - $item->quantity);

                $warehouse->stockMovements()->create([
                    'product_id' => $item->product_id,
                    'type' => StockMovementType::Out,
                    'quantity' => $item->quantity,
                    'resulting_quantity' => $newQuantity,
                ]);
            }

            $entry->update([
                'status' => ReturnEntryStatus::Completed,
                'confirmed_at' => now(),
            ]);
        });
    }
}
