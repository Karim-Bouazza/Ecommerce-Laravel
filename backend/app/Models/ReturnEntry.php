<?php

namespace App\Models;

use App\Enums\ReturnEntryPaymentStatus;
use App\Enums\ReturnEntryStatus;
use App\Enums\WalletTransactionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnEntry extends Model
{
    protected ?int $paidAmountCache = null;

    protected $fillable = [
        'reference',
        'purchase_entry_id',
        'warehouse_id',
        'fournisseur_id',
        'remark',
        'status',
        'total',
        'confirmed_at',
        'created_by',
    ];

    protected $casts = [
        'status' => ReturnEntryStatus::class,
        'total' => 'integer',
        'confirmed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ReturnEntry $entry) {
            $entry->created_by ??= auth()->id();
        });
    }

    public function purchaseEntry(): BelongsTo
    {
        return $this->belongsTo(PurchaseEntry::class);
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
        return $this->hasMany(ReturnEntryItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isPending(): bool
    {
        return $this->status === ReturnEntryStatus::Pending;
    }

    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->where('category', WalletTransactionCategory::Deposit);
    }

    public function paidAmount(): int
    {
        if (array_key_exists('paid_amount_sum', $this->attributes)) {
            return (int) $this->attributes['paid_amount_sum'];
        }

        return $this->paidAmountCache ??= (int) $this->versements()->sum('amount');
    }

    public function remainingAmount(): int
    {
        return max(0, $this->total - $this->paidAmount());
    }

    public function paymentStatus(): ReturnEntryPaymentStatus
    {
        return $this->paidAmount() > 0 ? ReturnEntryPaymentStatus::Paid : ReturnEntryPaymentStatus::Unpaid;
    }
}
