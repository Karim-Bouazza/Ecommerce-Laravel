<?php

namespace App\Data\Catalog;

use Spatie\LaravelData\Data;

class ProductSpecInputData extends Data
{
    public function __construct(
        public string $label,
        public string $value,
    ) {}
}
