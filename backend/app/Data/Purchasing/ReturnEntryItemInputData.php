<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Data;

class ReturnEntryItemInputData extends Data
{
    public function __construct(
        public int $purchase_entry_item_id,
        public int $quantity,
    ) {}
}
