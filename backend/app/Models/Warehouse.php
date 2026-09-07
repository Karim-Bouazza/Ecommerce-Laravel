<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'remark',
        'address',
        'all_wilayas',
        'all_products',
        'active',
    ];

    protected $casts = [
        'all_wilayas' => 'boolean',
        'all_products' => 'boolean',
        'active' => 'boolean',
    ];

    public function wilayas(): BelongsToMany
    {
        return $this->belongsToMany(Wilaya::class, 'warehouse_wilaya');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'warehouse_product');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(WarehouseStockMovement::class);
    }
}
