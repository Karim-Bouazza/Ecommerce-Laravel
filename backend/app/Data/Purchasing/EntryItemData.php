<?php

namespace App\Data\Purchasing;

use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class EntryItemData extends Data
{
    public function __construct(
        public int $id,
        public int|null|Optional $purchase_entry_item_id,
        public ?int $product_id,
        public string|Optional $product_name,
        public mixed $quantity,
        public mixed $purchase_price,
        public mixed $subtotal,
    ) {}

    public static function fromPurchaseItem(Model $item): self
    {
        return new self(
            id: $item->id,
            purchase_entry_item_id: new Optional(),
            product_id: $item->product_id,
            product_name: $item->relationLoaded('product') ? $item->product->name : new Optional(),
            quantity: $item->quantity,
            purchase_price: $item->purchase_price,
            subtotal: $item->subtotal,
        );
    }

    public static function fromReturnItem(Model $item): self
    {
        return new self(
            id: $item->id,
            purchase_entry_item_id: $item->purchase_entry_item_id,
            product_id: $item->product_id,
            product_name: $item->relationLoaded('product') ? $item->product->name : new Optional(),
            quantity: $item->quantity,
            purchase_price: $item->purchase_price,
            subtotal: $item->subtotal,
        );
    }
}
