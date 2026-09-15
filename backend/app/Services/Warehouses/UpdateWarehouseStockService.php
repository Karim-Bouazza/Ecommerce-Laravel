<?php

namespace App\Services\Warehouses;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class UpdateWarehouseStockService
{
    public function execute(Warehouse $warehouse, Product $product, int $adjustment, float $purchasePrice, int $stockMinimum): void
    {
        DB::transaction(function () use ($warehouse, $product, $adjustment, $purchasePrice, $stockMinimum): void {
            $current = Stock::lockAndGetInDepot($warehouse->id, $product->id);

            $newQuantity = max(0, $current + $adjustment);

            $product->update([
                'purchase_price' => $purchasePrice,
                'stock_minimum' => max(0, $stockMinimum),
            ]);

            $delta = $newQuantity - $current;

            if ($delta !== 0) {
                $warehouse->stockMovements()->create([
                    'product_id' => $product->id,
                    'type' => $delta > 0 ? StockMovementType::In : StockMovementType::Out,
                    'quantity' => abs($delta),
                    'resulting_quantity' => $newQuantity,
                ]);
            }
        });
    }
}
