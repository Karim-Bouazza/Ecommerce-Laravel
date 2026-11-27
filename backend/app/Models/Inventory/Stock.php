<?php

namespace App\Models\Inventory;

use App\Enums\Order\OrderStatus;
use App\Models\Catalog\Product;
use Closure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\DB;

class Stock extends Model
{
    protected $table = 'warehouse_product';

    public $timestamps = false;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantite_interne',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public static function inDepot(int $warehouseId, int $productId): int
    {
        return (int) DB::table('warehouse_product')
            ->where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->value('quantite_interne');
    }

    public static function total(int $productId): int
    {
        return (int) DB::table('warehouse_product')
            ->where('product_id', $productId)
            ->sum('quantite_interne');
    }

    public static function lockRow(int $warehouseId, int $productId): void
    {
        DB::table('warehouse_product')->insertOrIgnore([
            'warehouse_id' => $warehouseId,
            'product_id' => $productId,
        ]);

        DB::table('warehouse_product')
            ->where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->lockForUpdate()
            ->first();
    }

    public static function lockAndGetInDepot(int $warehouseId, int $productId): int
    {
        static::lockRow($warehouseId, $productId);

        return static::inDepot($warehouseId, $productId);
    }

    public static function inDepotSubquery(): QueryBuilder
    {
        return DB::table('warehouse_product')
            ->select('warehouse_id', 'product_id', 'quantite_interne as available_quantity');
    }

    public static function totalSubquery(): QueryBuilder
    {
        return DB::table('warehouse_product')
            ->selectRaw('product_id, SUM(quantite_interne) AS total_quantity')
            ->groupBy('product_id');
    }

    /**
     * Stock réservé: quantity tied up in orders confirmed but not yet shipped.
     */
    public static function reservedItemsQuery(?int $warehouseId): Closure
    {
        return static::orderItemsQuery(OrderStatus::Confirmed, $warehouseId);
    }

    /**
     * Stock en livraison: quantity out for delivery on shipped orders.
     */
    public static function inDeliveryItemsQuery(?int $warehouseId): Closure
    {
        return static::orderItemsQuery(OrderStatus::Shipped, $warehouseId);
    }

    /**
     * Stock en retour: quantity on its way back from a failed/refused delivery.
     */
    public static function inReturnItemsQuery(?int $warehouseId): Closure
    {
        return static::orderItemsQuery(OrderStatus::ReturnInProgress, $warehouseId);
    }

    public static function confirmedNoStockItemsQuery(?int $warehouseId): Closure
    {
        return static::orderItemsQuery(OrderStatus::ConfirmedNoStock, $warehouseId);
    }

    public static function soldItemsQuery(?int $warehouseId): Closure
    {
        return static::orderItemsQuery(OrderStatus::Delivered, $warehouseId);
    }

    protected static function orderItemsQuery(OrderStatus $status, ?int $warehouseId): Closure
    {
        return fn ($query) => $query
            ->whereHas('order', fn ($query) => $query->where('status', $status))
            ->when($warehouseId, fn ($query) => $query->where('warehouse_id', $warehouseId));
    }
}
