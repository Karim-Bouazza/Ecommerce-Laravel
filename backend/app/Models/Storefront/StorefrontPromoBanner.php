<?php

namespace App\Models\Storefront;

use App\Models\Concerns\HasImages;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

class StorefrontPromoBanner extends Model implements HasMedia
{
    use HasImages;

    /** Two banners side by side. */
    public const MAX_ITEMS = 2;

    protected $fillable = [
        'eyebrow',
        'title',
        'description',
        'button_label',
        'link_url',
        'highlight',
        'position',
    ];

    protected $casts = [
        'highlight' => 'boolean',
        'position' => 'integer',
    ];

    public function imageUrl(): ?string
    {
        return $this->mediaUrl('image');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
    }
}
