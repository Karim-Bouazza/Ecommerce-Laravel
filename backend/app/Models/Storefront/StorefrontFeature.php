<?php

namespace App\Models\Storefront;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class StorefrontFeature extends Model
{
    /** The bento grid of the "Nos Atouts" section holds five cards. */
    public const MAX_ITEMS = 5;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'position',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    public function imageUrl(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
