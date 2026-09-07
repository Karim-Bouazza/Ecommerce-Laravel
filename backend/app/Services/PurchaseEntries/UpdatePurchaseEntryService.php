<?php

namespace App\Services\PurchaseEntries;

use App\Models\PurchaseEntry;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdatePurchaseEntryService
{
    public function execute(PurchaseEntry $entry, array $data): void
    {
        if (! $entry->isPending()) {
            throw new RuntimeException('Seule une entrée en attente peut être modifiée.');
        }

        DB::transaction(function () use ($entry, $data): void {
            $items = $data['items'] ?? [];

            $entry->items()->delete();

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

            $entry->update([
                'warehouse_id' => $data['warehouse_id'],
                'fournisseur_id' => $data['fournisseur_id'],
                'remark' => $data['remark'] ?? null,
                'total' => collect($items)->sum(fn (array $item) => (int) $item['quantity'] * (int) $item['purchase_price']),
            ]);
        });
    }
}
