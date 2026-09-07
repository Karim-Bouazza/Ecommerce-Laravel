<?php

namespace App\Models;

use App\Enums\StockMovementType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseStockMovement extends Model
{
    protected $fillable = [
        'warehouse_id',
        'product_id',
        'type',
        'quantity',
        'resulting_quantity',
        'created_by',
    ];

    protected $casts = [
        'type' => StockMovementType::class,
        'quantity' => 'integer',
        'resulting_quantity' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (WarehouseStockMovement $movement) {
            $movement->created_by ??= auth()->id();
        });
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function signedQuantity(): int
    {
        return $this->quantity * $this->type->sign();
    }
}
