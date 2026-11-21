<?php

namespace App\Data\Inventory;

use App\Models\Inventory\WarehouseTransferItem;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class TransferItemData extends Data
{
    public function __construct(
        public int $id,
        public int $product_id,
        public string|Optional $product_name,
        public int $quantity,
    ) {}

    public static function fromItem(WarehouseTransferItem $item): self
    {
        return new self(
            id: $item->id,
            product_id: $item->product_id,
            product_name: $item->relationLoaded('product') ? $item->product->name : new Optional(),
            quantity: $item->quantity,
        );
    }
}
