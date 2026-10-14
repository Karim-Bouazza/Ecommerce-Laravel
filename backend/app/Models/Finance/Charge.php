<?php

namespace App\Models\Finance;

use App\Enums\Charge\ChargeCategory;
use App\Enums\Charge\ChargeOrderTrigger;
use App\Enums\Charge\ChargePaymentStatus;
use App\Enums\Charge\ChargeRecurrenceFrequency;
use App\Enums\Charge\ChargeType;
use App\Enums\Wallet\WalletTransactionCategory;
use App\Models\Catalog\Product;
use App\Services\Charges\CalculateChargeAmountService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Charge extends Model
{
    protected ?int $paidAmountCache = null;

    protected ?int $dueAmountCache = null;

    protected $attributes = [
        'is_active' => true,
        'all_products' => false,
    ];

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
        'is_active',
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
        'is_active' => 'boolean',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'charge_product');
    }

    public function pauses(): HasMany
    {
        return $this->hasMany(ChargePause::class);
    }

    public function versements(): HasMany
    {
        return $this->hasMany(WalletTransaction::class)->where('category', WalletTransactionCategory::Versement);
    }

    /**
     * Day the charge starts applying: its start date, or its creation day.
     */
    public function effectiveStart(): Carbon
    {
        return Carbon::parse($this->starts_at ?? $this->created_at ?? now())->startOfDay();
    }

    public function paidAmount(): int
    {
        if (array_key_exists('paid_amount_sum', $this->attributes)) {
            return (int) $this->attributes['paid_amount_sum'];
        }

        return $this->paidAmountCache ??= (int) $this->versements()->sum('amount');
    }

    /**
     * Total owed so far: the full amount for a one-off charge, what has accrued
     * up to today for a per-order or recurring charge.
     */
    public function dueAmount(): int
    {
        return $this->dueAmountCache ??= app(CalculateChargeAmountService::class)->dueAmount($this);
    }

    public function remainingAmount(): int
    {
        return max(0, $this->dueAmount() - $this->paidAmount());
    }

    public function paymentStatus(): ChargePaymentStatus
    {
        $paid = $this->paidAmount();
        $due = $this->dueAmount();

        return match (true) {
            $paid <= 0 => ChargePaymentStatus::Unpaid,
            $paid >= $due => ChargePaymentStatus::Paid,
            default => ChargePaymentStatus::Partial,
        };
    }

    /**
     * Forget computed amounts after the charge or its payments changed.
     */
    public function refreshAmounts(): static
    {
        $this->paidAmountCache = null;
        $this->dueAmountCache = null;
        unset($this->attributes['paid_amount_sum']);

        return $this;
    }
}
