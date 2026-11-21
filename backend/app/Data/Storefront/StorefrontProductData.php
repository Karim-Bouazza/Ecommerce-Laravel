<?php

namespace App\Data\Storefront;

use App\Models\Catalog\Product;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class StorefrontProductData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?int $category_id,
        public string|null|Optional $category,
        public mixed $price,
        public mixed $compare_price,
        public ?int $discount_percentage,
        public mixed $is_new,
        public bool $in_stock,
        public ?string $image,
    ) {}

    public static function fromProduct(Product $product): self
    {
        $hasDiscount = $product->compare_price !== null && $product->compare_price > $product->price;

        return new self(
            id: $product->id,
            name: $product->name,
            category_id: $product->category_id,
            category: $product->relationLoaded('category') ? $product->category?->name : new Optional(),
            price: $product->price,
            compare_price: $product->compare_price,
            discount_percentage: $hasDiscount
                ? (int) round((1 - $product->price / $product->compare_price) * 100)
                : null,
            is_new: $product->is_new,
            in_stock: (int) $product->total_stock > 0,
            image: $product->image_1 ? Storage::url($product->image_1) : null,
        );
    }
}
