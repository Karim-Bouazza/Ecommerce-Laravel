<?php

namespace App\Services\Transfers;

use App\Enums\StockMovementType;
use App\Enums\TransferStatus;
use App\Models\Stock;
use App\Models\WarehouseTransfer;
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

                $newSourceQuantity = $sourceQuantity - $item->quantity;

                $fromWarehouse->stockMovements()->create([
                    'product_id' => $item->product_id,
                    'type' => StockMovementType::Out,
                    'quantity' => $item->quantity,
                    'resulting_quantity' => $newSourceQuantity,
                ]);

                $destinationQuantity = Stock::inDepot($toWarehouse->id, $item->product_id);
                $newDestinationQuantity = $destinationQuantity + $item->quantity;

                $toWarehouse->stockMovements()->create([
                    'product_id' => $item->product_id,
                    'type' => StockMovementType::In,
                    'quantity' => $item->quantity,
                    'resulting_quantity' => $newDestinationQuantity,
                ]);
            }

            $transfer->update([
                'status' => TransferStatus::Completed,
                'confirmed_at' => now(),
            ]);
        });
    }
}
