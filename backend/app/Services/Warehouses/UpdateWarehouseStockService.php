<?php

namespace App\Services\Warehouses;

use App\Data\Inventory\AdjustStockData;
use App\Enums\Stock\StockMovementType;
use App\Models\Catalog\Product;
use App\Models\Inventory\Stock;
use App\Models\Inventory\Warehouse;
use Illuminate\Support\Facades\DB;

class UpdateWarehouseStockService
{
    public function execute(Warehouse $warehouse, Product $product, AdjustStockData $data): void
    {
        DB::transaction(function () use ($warehouse, $product, $data): void {
            $current = Stock::lockAndGetInDepot($warehouse->id, $product->id);

            $newQuantity = max(0, $current + $data->adjustment);

            $delta = $newQuantity - $current;

            if ($delta !== 0) {
                app(RecordStockMovementService::class)->execute(
                    $warehouse,
                    $product->id,
                    $delta > 0 ? StockMovementType::In : StockMovementType::Out,
                    abs($delta),
                );
            }
        });
    }
}
