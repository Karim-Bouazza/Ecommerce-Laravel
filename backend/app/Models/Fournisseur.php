<?php

namespace App\Models;

use App\Enums\PurchaseEntryPaymentStatus;
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
        'total_paid',
    ];

    protected $casts = [
        'total_paid' => 'integer',
    ];

    public function purchaseEntries(): HasMany
    {
        return $this->hasMany(PurchaseEntry::class);
    }

    public function totalDues(): int
    {
        return (int) $this->purchaseEntries()
            ->where('status', PurchaseEntryStatus::Completed)
            ->where('payment_status', PurchaseEntryPaymentStatus::Unpaid)
            ->sum('total');
    }

    public function remainingAmount(): int
    {
        return $this->totalDues() - $this->total_paid;
    }
}
