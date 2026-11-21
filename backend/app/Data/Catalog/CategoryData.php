<?php

namespace App\Data\Catalog;

use App\Models\Catalog\Category;
use Spatie\LaravelData\Data;

class CategoryData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public bool $is_active,
        public int $products_count,
        public bool $has_related_data,
    ) {}

    public static function fromCategory(Category $category): self
    {
        $productsCount = (int) ($category->products_count ?? 0);

        return new self(
            id: $category->id,
            name: $category->name,
            is_active: (bool) $category->is_active,
            products_count: $productsCount,
            has_related_data: $productsCount > 0,
        );
    }
}
