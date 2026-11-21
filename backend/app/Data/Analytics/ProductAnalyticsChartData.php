<?php

namespace App\Data\Analytics;

use App\Models\Catalog\Product;
use Spatie\LaravelData\Data;

class ProductAnalyticsChartData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public int $commandes_livrees,
    ) {}

    public static function fromProduct(Product $product): self
    {
        return new self($product->id, $product->name, (int) $product->delivered_count);
    }
}
