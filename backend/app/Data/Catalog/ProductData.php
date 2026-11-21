<?php

namespace App\Data\Catalog;

use App\Models\Catalog\Product;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class ProductData extends Data
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
        public mixed $purchase_price,
        public mixed $price,
        public mixed $compare_price,
        public int $total_stock,
        public mixed $is_active,
        public mixed $is_new,
        public ?string $image,
        public array $images,
    ) {}

    public static function fromProduct(Product $product): self
    {
        return new self(
            id: $product->id,
            sku: $product->sku,
            name: $product->name,
            description: $product->description,
            short_description: $product->short_description,
            category_id: $product->category_id,
            category: $product->relationLoaded('category') ? $product->category?->name : new Optional(),
            specs: $product->relationLoaded('specs')
                ? $product->specs->map(fn ($spec) => ProductSpecData::fromSpec($spec))->all()
                : new Optional(),
            variants: $product->relationLoaded('variants')
                ? $product->variants->map(fn ($variant) => ProductVariantData::fromVariant($variant))->all()
                : new Optional(),
            purchase_price: $product->purchase_price,
            price: $product->price,
            compare_price: $product->compare_price,
            total_stock: $product->totalStock(),
            is_active: $product->is_active,
            is_new: $product->is_new,
            image: $product->image_1 ? Storage::url($product->image_1) : null,
            images: collect([$product->image_1, $product->image_2, $product->image_3, $product->image_4])
                ->map(fn (?string $image) => $image ? Storage::url($image) : null)
                ->values()
                ->all(),
        );
    }
}
