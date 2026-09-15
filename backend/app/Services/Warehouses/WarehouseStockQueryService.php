<?php

namespace App\Services\Warehouses;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\JoinClause;

class WarehouseStockQueryService
{
    /**
     * All products stocked in the given warehouse, with their depot quantity (from the
     * stock movement ledger) and their (product-level) minimum threshold.
     */
    public function productsQuery(Warehouse $warehouse): Builder
    {
        return $this->baseQuery($warehouse)->orderBy('products.name');
    }

    /**
     * Products in the given warehouse whose quantity has dropped to or below their configured minimum.
     * Products without a minimum set (0, the default) never trigger an alert.
     */
    public function lowStockQuery(Warehouse $warehouse): Builder
    {
        return $this->baseQuery($warehouse)
            ->where('products.stock_minimum', '>', 0)
            ->whereRaw('coalesce(stock_ledger.available_quantity, 0) <= products.stock_minimum')
            ->orderBy('products.name');
    }

    public function lowStockCount(Warehouse $warehouse): int
    {
        return $this->lowStockQuery($warehouse)->count();
    }

    public function totalLowStockCount(): int
    {
        return Warehouse::query()
            ->where('active', true)
            ->get()
            ->sum(fn (Warehouse $warehouse) => $this->lowStockCount($warehouse));
    }

    protected function baseQuery(Warehouse $warehouse): Builder
    {
        $joinMethod = $warehouse->all_products ? 'leftJoin' : 'join';

        return Product::query()
            ->{$joinMethod}('warehouse_product', function (JoinClause $join) use ($warehouse) {
                $join->on('warehouse_product.product_id', '=', 'products.id')
                    ->where('warehouse_product.warehouse_id', '=', $warehouse->id);
            })
            ->leftJoinSub(Stock::inDepotSubquery(), 'stock_ledger', function (JoinClause $join) use ($warehouse) {
                $join->on('stock_ledger.product_id', '=', 'products.id')
                    ->where('stock_ledger.warehouse_id', '=', $warehouse->id);
            })
            ->select('products.*')
            ->selectRaw('coalesce(stock_ledger.available_quantity, 0) as warehouse_quantity')
            ->selectRaw('coalesce(products.stock_minimum, 0) as warehouse_stock_minimum');
    }
}
