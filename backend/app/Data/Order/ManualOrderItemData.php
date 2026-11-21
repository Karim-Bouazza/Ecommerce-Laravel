<?php

namespace App\Data\Order;

use Spatie\LaravelData\Data;

class ManualOrderItemData extends Data
{
    public function __construct(
        public int $warehouse_id,
        public int $product_id,
        public int $quantity,
        public ?string $variant = null,
        public int|float|null $unit_price = null,
        public ?int $id = null,
    ) {}
}
