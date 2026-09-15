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

    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(WarehouseTransfer::class, 'from_warehouse_id');
    }

    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(WarehouseTransfer::class, 'to_warehouse_id');
    }

    /**
     * The "Default" warehouse (seeded once, see the seed_default_warehouse
     * migration) always takes priority when a single fallback warehouse is needed.
     */
    public static function default(): ?self
    {
        return static::query()
            ->orderByRaw("(name = 'Default') desc")
            ->orderBy('id')
            ->first();
    }
}
