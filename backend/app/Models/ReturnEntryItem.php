<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReturnEntryItem extends Model
{
    protected $fillable = [
        'return_entry_id',
        'purchase_entry_item_id',
        'product_id',
        'quantity',
        'purchase_price',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'purchase_price' => 'integer',
        'subtotal' => 'integer',
    ];

    public function returnEntry(): BelongsTo
    {
        return $this->belongsTo(ReturnEntry::class);
    }

    public function purchaseEntryItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseEntryItem::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
