<?php

namespace App\Models\Storefront;

use App\Enums\Storefront\StorefrontProductSection;
use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorefrontSectionProduct extends Model
{
    protected $fillable = [
        'section',
        'product_id',
        'label',
        'position',
    ];

    protected $casts = [
        'section' => StorefrontProductSection::class,
        'position' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeInSection(Builder $query, StorefrontProductSection $section): Builder
    {
        return $query->where('section', $section->value);
    }
}
