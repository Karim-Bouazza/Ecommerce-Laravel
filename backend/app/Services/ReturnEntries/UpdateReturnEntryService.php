<?php

namespace App\Services\ReturnEntries;

use App\Models\PurchaseEntryItem;
use App\Models\ReturnEntry;
use App\Models\ReturnEntryItem;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdateReturnEntryService
{
    public function execute(ReturnEntry $entry, array $data): void
    {
        if (! $entry->isPending()) {
            throw new RuntimeException('Seule une entrée en attente peut être modifiée.');
        }

        DB::transaction(function () use ($entry, $data): void {
            $items = $data['items'] ?? [];

            $entry->items()->delete();

            $total = 0;

            foreach ($items as $item) {
                $purchaseEntryItem = PurchaseEntryItem::query()->lockForUpdate()->findOrFail($item['purchase_entry_item_id']);

                if ($purchaseEntryItem->purchase_entry_id !== $entry->purchase_entry_id) {
                    throw new RuntimeException("Le produit sélectionné n'appartient pas à l'entrée d'achat de ce retour.");
                }

                $quantity = (int) $item['quantity'];
                $remaining = $this->remainingQuantity($purchaseEntryItem, $entry->id);

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

            $entry->update([
                'remark' => $data['remark'] ?? null,
                'total' => $total,
            ]);
        });
    }

    protected function remainingQuantity(PurchaseEntryItem $item, int $excludeReturnEntryId): int
    {
        $returned = ReturnEntryItem::query()
            ->where('purchase_entry_item_id', $item->id)
            ->where('return_entry_id', '!=', $excludeReturnEntryId)
            ->sum('quantity');

        return max(0, $item->quantity - (int) $returned);
    }
}
