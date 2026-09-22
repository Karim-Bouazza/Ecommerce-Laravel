<?php

namespace App\Models;

use App\Enums\PurchaseEntryStatus;
use App\Enums\WalletTransactionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Fournisseur extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'remark',
        'address',
    ];

    public function purchaseEntries(): HasMany
    {
        return $this->hasMany(PurchaseEntry::class);
    }

    public function completedPurchaseEntries(): HasMany
    {
        return $this->purchaseEntries()->where('status', PurchaseEntryStatus::Completed);
    }

    /**
     * Versements paid directly to this fournisseur, not tied to a specific purchase entry.
     */
    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)
            ->whereNull('purchase_entry_id')
            ->where('category', WalletTransactionCategory::Versement);
    }

    /**
     * Versements paid against this fournisseur's completed purchase entries.
     */
    public function completedPurchaseEntryVersements(): HasManyThrough
    {
        return $this->hasManyThrough(
            WalletTransaction::class,
            PurchaseEntry::class,
            'fournisseur_id',
            'purchase_entry_id',
            'id',
            'id'
        )
            ->where('purchase_entries.status', PurchaseEntryStatus::Completed)
            ->where('wallet_transactions.category', WalletTransactionCategory::Versement);
    }

    public function totalDues(): int
    {
        if (array_key_exists('total_dues_sum', $this->attributes)) {
            return (int) $this->attributes['total_dues_sum'];
        }

        return (int) $this->completedPurchaseEntries()->sum('total');
    }

    public function totalPaid(): int
    {
        if (array_key_exists('entries_paid_amount', $this->attributes) && array_key_exists('direct_paid_amount', $this->attributes)) {
            return (int) $this->attributes['entries_paid_amount'] + (int) $this->attributes['direct_paid_amount'];
        }

        $entriesPaid = (int) $this->completedPurchaseEntries()->get()->sum(fn (PurchaseEntry $entry) => $entry->paidAmount());

        return $entriesPaid + (int) $this->versements()->sum('amount');
    }

    public function remainingAmount(): int
    {
        return max(0, $this->totalDues() - $this->totalPaid());
    }
}
