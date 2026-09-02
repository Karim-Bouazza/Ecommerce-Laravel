<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAdSpend extends Model
{
    protected $fillable = [
        'product_id',
        'date',
        'amount_usd',
    ];

    protected $casts = [
        'date' => 'date',
        'amount_usd' => 'decimal:2',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function amountDzd(): float
    {
        return (float) $this->amount_usd * config('ads.usd_to_dzd_rate');
    }
}
