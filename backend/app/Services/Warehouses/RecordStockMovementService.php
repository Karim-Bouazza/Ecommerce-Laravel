<?php

namespace App\Services\Warehouses;

use App\Enums\Stock\StockMovementType;
use App\Models\Inventory\Stock;
use App\Models\Inventory\Warehouse;
use App\Models\Inventory\WarehouseStockMovement;

class RecordStockMovementService
{
    public function execute(
        Warehouse $warehouse,
        int $productId,
        StockMovementType $type,
        int $quantity,
    ): WarehouseStockMovement {
        $current = Stock::lockAndGetInDepot($warehouse->id, $productId);

        $movement = $warehouse->stockMovements()->create([
            'product_id' => $productId,
            'type' => $type,
            'quantity' => $quantity,
        ]);

        Stock::query()
            ->where('warehouse_id', $warehouse->id)
            ->where('product_id', $productId)
            ->update(['quantite_interne' => max(0, $current + $movement->signedQuantity())]);

        return $movement;
    }
}
