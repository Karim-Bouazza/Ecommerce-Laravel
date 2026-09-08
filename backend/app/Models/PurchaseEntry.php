<?php

namespace App\Models;

use App\Enums\PurchaseEntryPaymentStatus;
use App\Enums\PurchaseEntryStatus;
use App\Enums\WalletTransactionCategory;
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
        'total',
        'confirmed_at',
        'created_by',
    ];

    protected $casts = [
        'status' => PurchaseEntryStatus::class,
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

    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->where('category', WalletTransactionCategory::Versement);
    }

    public function isPending(): bool
    {
        return $this->status === PurchaseEntryStatus::Pending;
    }

    public function paidAmount(): int
    {
        return (int) $this->versements()->sum('amount');
    }

    public function remainingAmount(): int
    {
        return max(0, $this->total - $this->paidAmount());
    }

    public function paymentStatus(): PurchaseEntryPaymentStatus
    {
        $paid = $this->paidAmount();

        return match (true) {
            $paid <= 0 => PurchaseEntryPaymentStatus::Unpaid,
            $paid >= $this->total => PurchaseEntryPaymentStatus::Paid,
            default => PurchaseEntryPaymentStatus::Partial,
        };
    }
}
