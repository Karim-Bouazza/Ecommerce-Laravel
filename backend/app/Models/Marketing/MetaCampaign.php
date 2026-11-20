<?php

namespace App\Models\Marketing;

use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetaCampaign extends Model
{
    protected $fillable = ['meta_campaign_id', 'name', 'product_id'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
