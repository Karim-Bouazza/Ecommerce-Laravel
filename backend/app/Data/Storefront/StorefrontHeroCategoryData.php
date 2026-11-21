<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontHeroCategory;
use Spatie\LaravelData\Data;

class StorefrontHeroCategoryData extends Data
{
    public function __construct(
        public int $id,
        public mixed $position,
        public ?string $image_url,
        public int $category_id,
        public string $category_name,
        public mixed $item_count,
    ) {}

    public static function fromHeroCategory(StorefrontHeroCategory $heroCategory): self
    {
        return new self(
            id: $heroCategory->id,
            position: $heroCategory->position,
            image_url: $heroCategory->mediaUrl('image'),
            category_id: $heroCategory->category_id,
            category_name: $heroCategory->category->name,
            item_count: $heroCategory->category->products_count ?? $heroCategory->category->products()->count(),
        );
    }
}
