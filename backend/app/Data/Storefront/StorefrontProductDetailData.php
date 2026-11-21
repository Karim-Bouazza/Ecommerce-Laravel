<?php

namespace App\Data\Storefront;

use App\Models\Catalog\Product;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class StorefrontProductDetailData extends Data
{
    public function __construct(
        public int $id,
        public ?string $sku,
        public string $name,
        public ?string $description,
        public ?string $short_description,
        public ?int $category_id,
        public string|null|Optional $category,
        public array|Optional $specs,
        public array|Optional $variants,
        public mixed $price,
        public mixed $compare_price,
        public ?int $discount_percentage,
        public mixed $is_new,
        public bool $in_stock,
        public int $stock,
        public array $images,
    ) {}

    public static function fromProduct(Product $product): self
    {
        $hasDiscount = $product->compare_price !== null && $product->compare_price > $product->price;

        return new self(
            id: $product->id,
            sku: $product->sku,
            name: $product->name,
            description: $product->description,
            short_description: $product->short_description,
            category_id: $product->category_id,
            category: $product->relationLoaded('category') ? $product->category?->name : new Optional(),
            specs: $product->relationLoaded('specs')
                ? $product->specs->map(fn ($spec) => ['label' => $spec->label, 'value' => $spec->value])->values()->all()
                : new Optional(),
            variants: $product->relationLoaded('variants')
                ? $product->variants->map(fn ($variant) => ['id' => $variant->id, 'label' => $variant->label])->values()->all()
                : new Optional(),
            price: $product->price,
            compare_price: $product->compare_price,
            discount_percentage: $hasDiscount
                ? (int) round((1 - $product->price / $product->compare_price) * 100)
                : null,
            is_new: $product->is_new,
            in_stock: (int) $product->total_stock > 0,
            stock: (int) $product->total_stock,
            images: array_values(array_filter($product->imageUrls())),
        );
    }
}
