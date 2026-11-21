<?php

namespace App\Models\Storefront;

use App\Models\Catalog\Category;
use App\Models\Concerns\HasImages;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;

class StorefrontHeroCategory extends Model implements HasMedia
{
    use HasImages;

    public const MAX_ITEMS = 5;

    protected $table = 'storefront_hero_categories';

    protected $fillable = [
        'category_id',
        'position',
    ];

    protected $appends = [
        'image_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->mediaUrl('image'),
        );
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
    }
}
