<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Data;

class PurchaseEntryItemInputData extends Data
{
    public function __construct(
        public int $product_id,
        public int $quantity,
        public int $purchase_price,
    ) {}
}
