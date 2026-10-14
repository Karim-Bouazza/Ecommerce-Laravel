<?php

namespace App\Models\Storefront;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class StorefrontPromoBanner extends Model
{
    /** Two banners side by side. */
    public const MAX_ITEMS = 2;

    protected $fillable = [
        'eyebrow',
        'title',
        'description',
        'button_label',
        'link_url',
        'highlight',
        'image_path',
        'position',
    ];

    protected $casts = [
        'highlight' => 'boolean',
        'position' => 'integer',
    ];

    public function imageUrl(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
