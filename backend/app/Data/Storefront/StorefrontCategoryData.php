<?php

namespace App\Data\Storefront;

use App\Models\Catalog\Category;
use Spatie\LaravelData\Data;

class StorefrontCategoryData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public mixed $products_count,
    ) {}

    public static function fromCategory(Category $category): self
    {
        return new self($category->id, $category->name, $category->products_count);
    }
}
