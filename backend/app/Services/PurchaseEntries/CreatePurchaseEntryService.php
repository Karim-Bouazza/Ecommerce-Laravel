<?php

namespace App\Services\PurchaseEntries;

use App\Models\PurchaseEntry;
use Illuminate\Support\Facades\DB;

class CreatePurchaseEntryService
{
    public function execute(array $data): PurchaseEntry
    {
        return DB::transaction(function () use ($data): PurchaseEntry {
            $items = $data['items'] ?? [];

            $entry = PurchaseEntry::create([
                'reference' => $this->generateReference(),
                'warehouse_id' => $data['warehouse_id'],
                'fournisseur_id' => $data['fournisseur_id'],
                'remark' => $data['remark'] ?? null,
                'total' => $this->itemsTotal($items),
            ]);

            $this->syncItems($entry, $items);

            return $entry;
        });
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function syncItems(PurchaseEntry $entry, array $items): void
    {
        foreach ($items as $item) {
            $quantity = (int) $item['quantity'];
            $purchasePrice = (int) $item['purchase_price'];

            $entry->items()->create([
                'product_id' => $item['product_id'],
                'variant' => $item['variant'] ?? null,
                'quantity' => $quantity,
                'purchase_price' => $purchasePrice,
                'subtotal' => $quantity * $purchasePrice,
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function itemsTotal(array $items): int
    {
        return collect($items)->sum(fn (array $item) => (int) $item['quantity'] * (int) $item['purchase_price']);
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
