<?php

namespace App\Models;

use App\Enums\PurchaseEntryStatus;
use App\Enums\WalletTransactionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * Versements paid directly to this fournisseur, not tied to a specific purchase entry.
     */
    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)
            ->whereNull('purchase_entry_id')
            ->where('category', WalletTransactionCategory::Versement);
    }

    protected function completedPurchaseEntries()
    {
        return $this->purchaseEntries()
            ->where('status', PurchaseEntryStatus::Completed)
            ->get();
    }

    public function totalDues(): int
    {
        return (int) $this->completedPurchaseEntries()->sum('total');
    }

    public function totalPaid(): int
    {
        $entriesPaid = (int) $this->completedPurchaseEntries()->sum(fn (PurchaseEntry $entry) => $entry->paidAmount());

        return $entriesPaid + (int) $this->versements()->sum('amount');
    }

    public function remainingAmount(): int
    {
        return max(0, $this->totalDues() - $this->totalPaid());
    }
}
