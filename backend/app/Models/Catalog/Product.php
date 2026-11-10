<?php

namespace App\Models\Catalog;

use App\Models\Inventory\Stock;
use App\Models\Inventory\WarehouseStockMovement;
use App\Models\Order\OrderItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * @property int|float|null $stock_in
 * @property int|float|null $stock_out
 * @property int|float|null $reserved_quantity
 * @property int|float|null $in_delivery_quantity
 * @property int|float|null $in_delivery_value
 * @property int|float|null $in_return_quantity
 * @property int|float|null $confirmed_no_stock_quantity
 * @property int|float|null $sold_quantity
 *
 * @property-read int $stock_interne
 * @property-read int $stock_total
 * @property-read int $stock_reserve
 * @property-read int $stock_en_livraison
 * @property-read int $stock_en_retour
 * @property-read int $confirme_sans_stock
 * @property-read int $vendu
 * @property-read float|null $valeur_du_stock
 * @property-read float $valeur_en_livraison
 */
class Product extends Model
{
    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'description',
        'short_description',
        'price',
        'purchase_price',
        'compare_price',
        'stock_minimum',
        'image_1',
        'image_2',
        'image_3',
        'image_4',
        'is_active',
        'is_new',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_new' => 'boolean',
        'stock_minimum' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function specs(): HasMany
    {
        return $this->hasMany(ProductSpec::class)->orderBy('sort_order');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function adSpends(): HasMany
    {
        return $this->hasMany(ProductAdSpend::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(WarehouseStockMovement::class);
    }

    public function totalStock(): int
    {
        return Stock::total($this->id);
    }

    public function scopeWithStockSums(Builder $query, ?int $warehouseId = null): Builder
    {
        $internal = DB::table('warehouse_product')
            ->when($warehouseId, fn ($query) => $query->where('warehouse_id', $warehouseId))
            ->groupBy('product_id')
            ->selectRaw('product_id, SUM(quantite_interne) AS quantite_interne');

        return $query
            ->leftJoinSub($internal, 'stock_internal', 'stock_internal.product_id', '=', 'products.id')
            ->select([
                'products.id',
                'products.name',
                'products.image_1',
                'products.purchase_price',
                'stock_internal.quantite_interne',
            ])
            ->withSum(['orderItems as reserved_quantity' => Stock::reservedItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as in_delivery_quantity' => Stock::inDeliveryItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as in_delivery_value' => Stock::inDeliveryItemsQuery($warehouseId)], 'total_price')
            ->withSum(['orderItems as in_return_quantity' => Stock::inReturnItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as confirmed_no_stock_quantity' => Stock::confirmedNoStockItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as sold_quantity' => Stock::soldItemsQuery($warehouseId)], 'quantity');
    }

    public static function stockInterneSql(): string
    {
        return 'COALESCE(stock_internal.quantite_interne, 0)';
    }

    protected function stockInterne(): Attribute
    {
        return Attribute::make(
            get: fn() => (int) $this->quantite_interne,
        );
    }

    protected function stockReserve(): Attribute
    {
        return Attribute::make(get: fn() => (int) $this->reserved_quantity);
    }

    protected function stockEnLivraison(): Attribute
    {
        return Attribute::make(get: fn() => (int) $this->in_delivery_quantity);
    }

    protected function stockEnRetour(): Attribute
    {
        return Attribute::make(get: fn() => (int) $this->in_return_quantity);
    }

    protected function confirmeSansStock(): Attribute
    {
        return Attribute::make(get: fn() => (int) $this->confirmed_no_stock_quantity);
    }

    protected function vendu(): Attribute
    {
        return Attribute::make(get: fn() => (int) $this->sold_quantity);
    }

    protected function stockTotal(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->stock_interne + $this->stock_reserve + $this->stock_en_livraison + $this->stock_en_retour,
        );
    }

    protected function valeurDuStock(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->purchase_price !== null ? $this->stock_total * $this->purchase_price : null,
        );
    }

    protected function valeurEnLivraison(): Attribute
    {
        return Attribute::make(get: fn() => (float) $this->in_delivery_value);
    }
}
