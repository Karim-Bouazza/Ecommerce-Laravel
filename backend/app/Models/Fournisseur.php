<?php

namespace App\Models;

use App\Enums\PurchaseEntryStatus;
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
        return (int) $this->completedPurchaseEntries()->sum(fn (PurchaseEntry $entry) => $entry->paidAmount());
    }

    public function remainingAmount(): int
    {
        return max(0, $this->totalDues() - $this->totalPaid());
    }
}
