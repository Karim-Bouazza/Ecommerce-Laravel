<?php

namespace App\Data\Catalog;

use App\Models\Catalog\ProductVariant;
use Spatie\LaravelData\Data;

class ProductVariantData extends Data
{
    public function __construct(
        public int $id,
        public string $label,
    ) {}

    public static function fromVariant(ProductVariant $variant): self
    {
        return new self($variant->id, $variant->label);
    }
}
