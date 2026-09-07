<?php

namespace App\Models;

use App\Enums\PurchaseEntryPaymentStatus;
use App\Enums\PurchaseEntryStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseEntry extends Model
{
    protected $fillable = [
        'reference',
        'warehouse_id',
        'fournisseur_id',
        'remark',
        'status',
        'payment_status',
        'total',
        'confirmed_at',
        'created_by',
    ];

    protected $casts = [
        'status' => PurchaseEntryStatus::class,
        'payment_status' => PurchaseEntryPaymentStatus::class,
        'total' => 'integer',
        'confirmed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (PurchaseEntry $entry) {
            $entry->created_by ??= auth()->id();
        });
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseEntryItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isPending(): bool
    {
        return $this->status === PurchaseEntryStatus::Pending;
    }
}
