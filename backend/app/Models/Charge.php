<?php

namespace App\Models;

use App\Enums\ChargeCategory;
use App\Enums\ChargeOrderTrigger;
use App\Enums\ChargePaymentStatus;
use App\Enums\ChargeRecurrenceFrequency;
use App\Enums\ChargeType;
use App\Enums\WalletTransactionCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Charge extends Model
{
    protected ?int $paidAmountCache = null;

    protected $fillable = [
        'category',
        'type',
        'order_trigger',
        'recurrence_frequency',
        'name',
        'amount',
        'all_products',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'category' => ChargeCategory::class,
        'type' => ChargeType::class,
        'order_trigger' => ChargeOrderTrigger::class,
        'recurrence_frequency' => ChargeRecurrenceFrequency::class,
        'amount' => 'integer',
        'all_products' => 'boolean',
        'starts_at' => 'date',
        'ends_at' => 'date',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'charge_product');
    }

    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->where('category', WalletTransactionCategory::Versement);
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
        return max(0, $this->amount - $this->paidAmount());
    }

    public function paymentStatus(): ChargePaymentStatus
    {
        $paid = $this->paidAmount();

        return match (true) {
            $paid <= 0 => ChargePaymentStatus::Unpaid,
            $paid >= $this->amount => ChargePaymentStatus::Paid,
            default => ChargePaymentStatus::Partial,
        };
    }
}
