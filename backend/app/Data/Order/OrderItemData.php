<?php

namespace App\Data\Order;

use App\Models\Order\OrderItem;
use Spatie\LaravelData\Data;

class OrderItemData extends Data
{
    public function __construct(
        public int $id,
        public ?int $product_id,
        public ?string $product_name,
        public ?string $variant,
        public ?int $warehouse_id,
        public ?string $warehouse_name,
        public int $quantity,
        public int $price,
        public int $total_price,
    ) {}

    public static function fromItem(OrderItem $item): self
    {
        return new self(
            id: $item->id,
            product_id: $item->product_id,
            product_name: $item->product_name,
            variant: $item->variant,
            warehouse_id: $item->warehouse_id,
            warehouse_name: $item->warehouse?->name,
            quantity: $item->quantity,
            price: (int) $item->price,
            total_price: (int) $item->total_price,
        );
    }
}
