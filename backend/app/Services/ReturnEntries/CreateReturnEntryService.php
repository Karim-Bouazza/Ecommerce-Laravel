<?php

namespace App\Services\ReturnEntries;

use App\Models\PurchaseEntry;
use App\Models\PurchaseEntryItem;
use App\Models\ReturnEntry;
use App\Models\ReturnEntryItem;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreateReturnEntryService
{
    public function execute(array $data): ReturnEntry
    {
        return DB::transaction(function () use ($data): ReturnEntry {
            $purchaseEntry = PurchaseEntry::query()->lockForUpdate()->findOrFail($data['purchase_entry_id']);
            $items = $data['items'] ?? [];

            $entry = ReturnEntry::create([
                'reference' => $this->generateReference(),
                'purchase_entry_id' => $purchaseEntry->id,
                'warehouse_id' => $purchaseEntry->warehouse_id,
                'fournisseur_id' => $purchaseEntry->fournisseur_id,
                'remark' => $data['remark'] ?? null,
                'total' => 0,
            ]);

            $total = $this->syncItems($entry, $purchaseEntry, $items);

            $entry->update(['total' => $total]);

            return $entry;
        });
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function syncItems(ReturnEntry $entry, PurchaseEntry $purchaseEntry, array $items): int
    {
        $total = 0;

        foreach ($items as $item) {
            $purchaseEntryItem = PurchaseEntryItem::query()->lockForUpdate()->findOrFail($item['purchase_entry_item_id']);

            if ($purchaseEntryItem->purchase_entry_id !== $purchaseEntry->id) {
                throw new RuntimeException("Le produit sélectionné n'appartient pas à l'entrée d'achat choisie.");
            }

            $quantity = (int) $item['quantity'];
            $remaining = $this->remainingQuantity($purchaseEntryItem);

            if ($quantity > $remaining) {
                $productName = $purchaseEntryItem->product?->name ?? 'produit';
                throw new RuntimeException("La quantité de retour pour {$productName} dépasse la quantité restante ({$remaining}).");
            }

            $subtotal = $quantity * $purchaseEntryItem->purchase_price;

            ReturnEntryItem::create([
                'return_entry_id' => $entry->id,
                'purchase_entry_item_id' => $purchaseEntryItem->id,
                'product_id' => $purchaseEntryItem->product_id,
                'quantity' => $quantity,
                'purchase_price' => $purchaseEntryItem->purchase_price,
                'subtotal' => $subtotal,
            ]);

            $total += $subtotal;
        }

        return $total;
    }

    protected function remainingQuantity(PurchaseEntryItem $item, ?int $excludeReturnEntryId = null): int
    {
        $returned = ReturnEntryItem::query()
            ->where('purchase_entry_item_id', $item->id)
            ->when($excludeReturnEntryId, fn ($query) => $query->where('return_entry_id', '!=', $excludeReturnEntryId))
            ->sum('quantity');

        return max(0, $item->quantity - (int) $returned);
    }

    protected function generateReference(): string
    {
        $prefix = 'R-'.now()->format('m-y').'-';

        $lastNumber = ReturnEntry::query()
            ->where('reference', 'like', $prefix.'%')
            ->lockForUpdate()
            ->get()
            ->map(fn (ReturnEntry $entry) => (int) substr($entry->reference, strlen($prefix)))
            ->max() ?? 0;

        return $prefix.str_pad((string) ($lastNumber + 1), 4, '0', STR_PAD_LEFT);
    }
}
