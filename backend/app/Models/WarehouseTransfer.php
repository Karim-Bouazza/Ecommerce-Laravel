<?php

namespace App\Models;

use App\Enums\TransferStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseTransfer extends Model
{
    protected $fillable = [
        'reference',
        'from_warehouse_id',
        'to_warehouse_id',
        'status',
        'remark',
        'confirmed_at',
        'created_by',
    ];

    protected $casts = [
        'status' => TransferStatus::class,
        'confirmed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (WarehouseTransfer $transfer) {
            $transfer->created_by ??= auth()->id();
        });
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(WarehouseTransferItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isPending(): bool
    {
        return $this->status === TransferStatus::Pending;
    }
}
