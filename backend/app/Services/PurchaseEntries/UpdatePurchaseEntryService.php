<?php

namespace App\Services\PurchaseEntries;

use App\Data\Purchasing\PurchaseEntryItemInputData;
use App\Data\Purchasing\SavePurchaseEntryData;
use App\Models\Purchasing\PurchaseEntry;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdatePurchaseEntryService
{
    public function execute(PurchaseEntry $entry, SavePurchaseEntryData $data): void
    {
        if (! $entry->isPending()) {
            throw new RuntimeException('Seule une entrée en attente peut être modifiée.');
        }

        DB::transaction(function () use ($entry, $data): void {
            $items = $data->items;

            $entry->items()->delete();

            foreach ($items as $item) {
                $quantity = $item->quantity;
                $purchasePrice = $item->purchase_price;

                $entry->items()->create([
                    'product_id' => $item->product_id,
                    'variant' => null,
                    'quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                    'subtotal' => $quantity * $purchasePrice,
                ]);
            }

            $entry->update([
                'warehouse_id' => $data->warehouse_id,
                'fournisseur_id' => $data->fournisseur_id,
                'remark' => $data->remark,
                'total' => collect($items)->sum(fn (PurchaseEntryItemInputData $item) => $item->quantity * $item->purchase_price),
            ]);
        });
    }
}
