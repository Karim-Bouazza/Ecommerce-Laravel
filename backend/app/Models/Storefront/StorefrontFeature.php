<?php

namespace App\Models\Storefront;

use App\Models\Concerns\HasImages;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;

class StorefrontFeature extends Model implements HasMedia
{
    use HasImages;

    /** The bento grid of the "Nos Atouts" section holds five cards. */
    public const MAX_ITEMS = 5;

    protected $fillable = [
        'title',
        'description',
        'position',
    ];

    protected $casts = [
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
