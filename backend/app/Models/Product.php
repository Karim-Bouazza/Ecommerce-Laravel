<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int|float|null $stock_in
 * @property int|float|null $stock_out
 * @property int|float|null $reserved_quantity
 * @property int|float|null $in_delivery_quantity
 * @property int|float|null $in_delivery_value
 * @property int|float|null $in_return_quantity
 * @property int|float|null $confirmed_no_stock_quantity
 * @property int|float|null $sold_quantity
 */
class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'purchase_price',
        'compare_price',
        'stock_minimum',
        'image_1',
        'image_2',
        'image_3',
        'image_4',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'stock_minimum' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
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

    /**
     * Total quantity of this product across every depot (warehouse).
     */
    public function totalStock(): int
    {
        return Stock::total($this->id);
    }
}
