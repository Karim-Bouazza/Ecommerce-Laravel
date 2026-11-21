<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontPromoBanner;
use Spatie\LaravelData\Data;

class StorefrontPromoBannerData extends Data
{
    public function __construct(
        public int $id,
        public mixed $position,
        public ?string $eyebrow,
        public string $title,
        public ?string $description,
        public string $button_label,
        public ?string $link_url,
        public mixed $highlight,
        public ?string $image_url,
    ) {}

    public static function fromBanner(StorefrontPromoBanner $banner): self
    {
        return new self(
            id: $banner->id,
            position: $banner->position,
            eyebrow: $banner->eyebrow,
            title: $banner->title,
            description: $banner->description,
            button_label: $banner->button_label,
            link_url: $banner->link_url,
            highlight: $banner->highlight,
            image_url: $banner->imageUrl(),
        );
    }
}
