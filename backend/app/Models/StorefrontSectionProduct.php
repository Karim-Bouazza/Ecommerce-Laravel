<?php

namespace App\Models;

use App\Enums\StorefrontProductSection;
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
