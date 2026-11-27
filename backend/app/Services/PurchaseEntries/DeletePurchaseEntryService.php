<?php

namespace App\Services\PurchaseEntries;

use App\Enums\Purchase\PurchaseEntryPaymentStatus;
use App\Enums\Stock\StockMovementType;
use App\Models\Purchasing\PurchaseEntry;
use App\Services\Warehouses\RecordStockMovementService;
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
            app(RecordStockMovementService::class)->execute(
                $warehouse,
                $item->product_id,
                StockMovementType::Out,
                $item->quantity,
            );
        }
    }
}
