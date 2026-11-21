<?php

namespace App\Data\Inventory;

use Spatie\LaravelData\Data;

class TransferItemInputData extends Data
{
    public function __construct(
        public int $product_id,
        public int $quantity,
    ) {}
}
