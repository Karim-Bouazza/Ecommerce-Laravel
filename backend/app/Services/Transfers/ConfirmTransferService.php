<?php

namespace App\Services\Transfers;

use App\Enums\Stock\StockMovementType;
use App\Models\Inventory\Stock;
use App\Models\Inventory\WarehouseTransfer;
use App\Services\Warehouses\RecordStockMovementService;
use App\States\Transfer\Completed;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConfirmTransferService
{
    public function execute(WarehouseTransfer $transfer): void
    {
        if (! $transfer->isPending()) {
            throw new RuntimeException('Ce transfert est déjà confirmé.');
        }

        DB::transaction(function () use ($transfer): void {
            $fromWarehouse = $transfer->fromWarehouse;
            $toWarehouse = $transfer->toWarehouse;

            [$firstId, $secondId] = $fromWarehouse->id < $toWarehouse->id
                ? [$fromWarehouse->id, $toWarehouse->id]
                : [$toWarehouse->id, $fromWarehouse->id];

            foreach ($transfer->items()->with('product')->get() as $item) {
                // Lock both warehouse/product rows for this product, in a stable
                // warehouse-id order, so concurrent transfers can't deadlock.
                Stock::lockRow($firstId, $item->product_id);
                Stock::lockRow($secondId, $item->product_id);

                $sourceQuantity = Stock::inDepot($fromWarehouse->id, $item->product_id);

                if ($sourceQuantity < $item->quantity) {
                    $productName = $item->product?->name ?? 'produit';

                    throw new RuntimeException("Stock insuffisant pour \"{$productName}\" dans l'entrepôt \"{$fromWarehouse->name}\".");
                }

                $recorder = app(RecordStockMovementService::class);

                $recorder->execute($fromWarehouse, $item->product_id, StockMovementType::Out, $item->quantity);
                $recorder->execute($toWarehouse, $item->product_id, StockMovementType::In, $item->quantity);
            }

            $transfer->confirmed_at = now();
            $transfer->status->transitionTo(Completed::class);
        });
    }
}
