<?php

namespace App\Services\PurchaseEntries;

use App\Data\Purchasing\PurchaseEntryItemInputData;
use App\Data\Purchasing\SavePurchaseEntryData;
use App\Models\Purchasing\PurchaseEntry;
use Illuminate\Support\Facades\DB;

class CreatePurchaseEntryService
{
    public function execute(SavePurchaseEntryData $data): PurchaseEntry
    {
        return DB::transaction(function () use ($data): PurchaseEntry {
            $items = $data->items;

            $entry = PurchaseEntry::create([
                'reference' => $this->generateReference(),
                'warehouse_id' => $data->warehouse_id,
                'fournisseur_id' => $data->fournisseur_id,
                'remark' => $data->remark,
                'total' => $this->itemsTotal($items),
            ]);

            $this->syncItems($entry, $items);

            return $entry;
        });
    }

    /**
     * @param  array<int, PurchaseEntryItemInputData>  $items
     */
    protected function syncItems(PurchaseEntry $entry, array $items): void
    {
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
    }

    /**
     * @param  array<int, PurchaseEntryItemInputData>  $items
     */
    protected function itemsTotal(array $items): int
    {
        return collect($items)->sum(fn (PurchaseEntryItemInputData $item) => $item->quantity * $item->purchase_price);
    }

    protected function generateReference(): string
    {
        $prefix = 'B-'.now()->format('m-y').'-';

        $lastNumber = PurchaseEntry::query()
            ->where('reference', 'like', $prefix.'%')
            ->lockForUpdate()
            ->get()
            ->map(fn (PurchaseEntry $entry) => (int) substr($entry->reference, strlen($prefix)))
            ->max() ?? 0;

        return $prefix.str_pad((string) ($lastNumber + 1), 4, '0', STR_PAD_LEFT);
    }
}
