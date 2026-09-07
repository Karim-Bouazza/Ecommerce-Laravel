<?php

namespace App\Services\PurchaseEntries;

use App\Enums\PurchaseEntryPaymentStatus;
use App\Enums\StockMovementType;
use App\Models\PurchaseEntry;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DeletePurchaseEntryService
{
    public function execute(PurchaseEntry $entry): void
    {
        if (! $entry->isPending() && $entry->payment_status === PurchaseEntryPaymentStatus::Paid) {
            throw new RuntimeException('Une entrée déjà payée ne peut pas être supprimée.');
        }

        DB::transaction(function () use ($entry): void {
            if (! $entry->isPending()) {
                $this->reverseStock($entry);
            }

            $entry->delete();
        });
    }

    protected function reverseStock(PurchaseEntry $entry): void
    {
        $warehouse = $entry->warehouse;

        foreach ($entry->items()->get() as $item) {
            $current = DB::table('warehouse_product')
                ->where('warehouse_id', $warehouse->id)
                ->where('product_id', $item->product_id)
                ->lockForUpdate()
                ->value('quantity') ?? 0;

            $newQuantity = max(0, $current - $item->quantity);

            DB::table('warehouse_product')->updateOrInsert(
                ['warehouse_id' => $warehouse->id, 'product_id' => $item->product_id],
                ['quantity' => $newQuantity]
            );

            $warehouse->stockMovements()->create([
                'product_id' => $item->product_id,
                'type' => StockMovementType::Out,
                'quantity' => $item->quantity,
                'resulting_quantity' => $newQuantity,
            ]);
        }
    }
}
