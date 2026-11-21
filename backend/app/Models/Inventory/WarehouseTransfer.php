<?php

namespace App\Models\Inventory;

use App\Models\Users\User;
use App\States\Transfer\Pending;
use App\States\Transfer\TransferState;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\ModelStates\HasStates;

class WarehouseTransfer extends Model
{
    use HasStates;

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
        'status' => TransferState::class,
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
        return $this->status->equals(Pending::class);
    }
}
