<?php

namespace App\Services\Warehouses;

use App\Enums\StockMovementType;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class UpdateWarehouseStockService
{
    public function execute(Warehouse $warehouse, Product $product, int $adjustment, float $purchasePrice, int $stockMinimum): void
    {
        DB::transaction(function () use ($warehouse, $product, $adjustment, $purchasePrice, $stockMinimum): void {
            $current = DB::table('warehouse_product')
                ->where('warehouse_id', $warehouse->id)
                ->where('product_id', $product->id)
                ->value('quantity') ?? 0;

            $newQuantity = max(0, $current + $adjustment);

            DB::table('warehouse_product')->updateOrInsert(
                ['warehouse_id' => $warehouse->id, 'product_id' => $product->id],
                ['quantity' => $newQuantity, 'stock_minimum' => max(0, $stockMinimum)]
            );

            $product->update(['purchase_price' => $purchasePrice]);

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
