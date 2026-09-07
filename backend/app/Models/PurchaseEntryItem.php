<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseEntryItem extends Model
{
    protected $fillable = [
        'purchase_entry_id',
        'product_id',
        'variant',
        'quantity',
        'purchase_price',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'purchase_price' => 'integer',
        'subtotal' => 'integer',
    ];

    public function purchaseEntry(): BelongsTo
    {
        return $this->belongsTo(PurchaseEntry::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
