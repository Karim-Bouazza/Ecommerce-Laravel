<?php

namespace App\Data\Storefront;

use App\Models\Storefront\StorefrontSectionProduct;
use Spatie\LaravelData\Data;

class StorefrontSectionProductData extends Data
{
    private const SPECS_SHOWN = 3;

    public function __construct(
        public int $id,
        public mixed $position,
        public ?string $label,
        public int $product_id,
        public string $name,
        public ?string $short_description,
        public mixed $price,
        public mixed $compare_price,
        public ?int $discount_percentage,
        public ?string $image,
        public array $images,
        public bool $is_active,
        public array $specs,
    ) {}

    public static function fromItem(StorefrontSectionProduct $item): self
    {
        $product = $item->product;
        $hasDiscount = $product->compare_price !== null && $product->compare_price > $product->price;

        $images = collect(array_values(array_filter($product->imageUrls())));

        return new self(
            id: $item->id,
            position: $item->position,
            label: $item->label,
            product_id: $product->id,
            name: $product->name,
            short_description: $product->short_description,
            price: $product->price,
            compare_price: $hasDiscount ? $product->compare_price : null,
            discount_percentage: $hasDiscount
                ? (int) round((1 - $product->price / $product->compare_price) * 100)
                : null,
            image: $images->first(),
            images: $images->all(),
            is_active: (bool) $product->is_active,
            specs: $product->specs->take(self::SPECS_SHOWN)->pluck('value')->values()->all(),
        );
    }
}
