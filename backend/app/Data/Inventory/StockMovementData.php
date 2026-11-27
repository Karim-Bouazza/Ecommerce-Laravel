<?php

namespace App\Data\Inventory;

use App\Models\Inventory\WarehouseStockMovement;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class StockMovementData extends Data
{
    public function __construct(
        public int $id,
        public string|Optional $product_name,
        public WarehouseRefData|Optional $warehouse,
        public int $quantity,
        public int $signed_quantity,
        public string $type,
        public string $type_label,
        public string $type_color,
        public string|null|Optional $creator_name,
        public ?CarbonInterface $created_at,
    ) {}

    public static function fromMovement(WarehouseStockMovement $movement): self
    {
        return new self(
            id: $movement->id,
            product_name: $movement->relationLoaded('product') ? $movement->product->name : new Optional(),
            warehouse: $movement->relationLoaded('warehouse')
                ? WarehouseRefData::fromWarehouse($movement->warehouse)
                : new Optional(),
            quantity: $movement->quantity,
            signed_quantity: $movement->signedQuantity(),
            type: $movement->type->value,
            type_label: $movement->type->label(),
            type_color: $movement->type->color(),
            creator_name: $movement->relationLoaded('creator') ? $movement->creator?->name : new Optional(),
            created_at: $movement->created_at,
        );
    }
}
