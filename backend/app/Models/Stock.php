<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
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
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Stock disponible: the on-hand quantity of one product in one depot (warehouse),
     * derived from the stock movement ledger rather than a stored counter.
     */
    public static function inDepot(int $warehouseId, int $productId): int
    {
        return (int) WarehouseStockMovement::query()
            ->where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->selectRaw(
                'COALESCE(SUM(CASE WHEN type = ? THEN quantity ELSE -quantity END), 0) AS balance',
                [StockMovementType::In->value]
            )
            ->value('balance');
    }

    /**
     * Total quantity of a product across every depot (warehouse).
     */
    public static function total(int $productId): int
    {
        return (int) WarehouseStockMovement::query()
            ->where('product_id', $productId)
            ->selectRaw(
                'COALESCE(SUM(CASE WHEN type = ? THEN quantity ELSE -quantity END), 0) AS balance',
                [StockMovementType::In->value]
            )
            ->value('balance');
    }

    /**
     * Locks the warehouse/product row (inserting it if missing) so concurrent
     * movements against the same pair serialize before their balance is read.
     */
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

    /**
     * Locks the row and returns the current depot balance in one step.
     */
    public static function lockAndGetInDepot(int $warehouseId, int $productId): int
    {
        static::lockRow($warehouseId, $productId);

        return static::inDepot($warehouseId, $productId);
    }

    /**
     * Aggregated available quantity per warehouse/product pair, for joining
     * into listing queries instead of computing one row at a time.
     */
    public static function inDepotSubquery(): QueryBuilder
    {
        return DB::table('warehouse_stock_movements')
            ->selectRaw(
                'warehouse_id, product_id, SUM(CASE WHEN type = ? THEN quantity ELSE -quantity END) AS available_quantity',
                [StockMovementType::In->value]
            )
            ->groupBy('warehouse_id', 'product_id');
    }

    /**
     * Aggregated total quantity per product across every depot, for joining
     * into listing queries instead of computing one row at a time.
     */
    public static function totalSubquery(): QueryBuilder
    {
        return DB::table('warehouse_stock_movements')
            ->selectRaw(
                'product_id, SUM(CASE WHEN type = ? THEN quantity ELSE -quantity END) AS total_quantity',
                [StockMovementType::In->value]
            )
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
