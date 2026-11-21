<?php

namespace App\Data\Catalog;

use App\Models\Catalog\ProductSpec;
use Spatie\LaravelData\Data;

class ProductSpecData extends Data
{
    public function __construct(
        public int $id,
        public string $label,
        public string $value,
    ) {}

    public static function fromSpec(ProductSpec $spec): self
    {
        return new self($spec->id, $spec->label, $spec->value);
    }
}
