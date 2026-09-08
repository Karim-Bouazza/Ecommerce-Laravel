<?php

namespace App\Models;

use App\Enums\WalletTransactionCategory;
use App\Enums\WalletTransactionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'purchase_entry_id',
        'reference',
        'date',
        'type',
        'category',
        'amount',
        'remark',
        'created_by',
        'transfer_group_id',
    ];

    protected $casts = [
        'date' => 'date',
        'type' => WalletTransactionType::class,
        'category' => WalletTransactionCategory::class,
        'amount' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (WalletTransaction $transaction) {
            $transaction->reference ??= self::generateReference();
            $transaction->created_by ??= auth()->id();
        });
    }

    public static function generateReference(): string
    {
        $now = now();

        $sequence = self::whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->count() + 1;

        return sprintf('R-%s-%s-%04d', $now->format('m'), $now->format('y'), $sequence);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }

    public function purchaseEntry(): BelongsTo
    {
        return $this->belongsTo(PurchaseEntry::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
