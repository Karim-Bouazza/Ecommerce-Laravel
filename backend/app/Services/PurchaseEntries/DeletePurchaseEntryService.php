<?php

namespace App\Services\PurchaseEntries;

use App\Enums\PurchaseEntryPaymentStatus;
use App\Enums\StockMovementType;
use App\Models\PurchaseEntry;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DeletePurchaseEntryService
{
    public function execute(PurchaseEntry $entry): void
    {
        if (! $entry->isPending() && $entry->paymentStatus() !== PurchaseEntryPaymentStatus::Unpaid) {
            throw new RuntimeException('Une entrée avec des versements ne peut pas être supprimée.');
        }

        if ($entry->returnEntries()->exists()) {
            throw new RuntimeException('Une entrée ayant des retours associés ne peut pas être supprimée.');
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
            $current = Stock::lockAndGetInDepot($warehouse->id, $item->product_id);
            $newQuantity = max(0, $current - $item->quantity);

            $warehouse->stockMovements()->create([
                'product_id' => $item->product_id,
                'type' => StockMovementType::Out,
                'quantity' => $item->quantity,
                'resulting_quantity' => $newQuantity,
            ]);
        }
    }
}
