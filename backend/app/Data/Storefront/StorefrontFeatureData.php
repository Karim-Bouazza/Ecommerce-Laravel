<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontFeature;
use Spatie\LaravelData\Data;

class StorefrontFeatureData extends Data
{
    public function __construct(
        public int $id,
        public mixed $position,
        public string $title,
        public ?string $description,
        public ?string $image_url,
    ) {}

    public static function fromFeature(StorefrontFeature $feature): self
    {
        return new self(
            id: $feature->id,
            position: $feature->position,
            title: $feature->title,
            description: $feature->description,
            image_url: $feature->imageUrl(),
        );
    }
}
