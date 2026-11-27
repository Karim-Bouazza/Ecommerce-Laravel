<?php

namespace App\Data\Inventory;

use App\Models\Inventory\Warehouse;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class WarehouseData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $phone,
        public ?string $address,
        public bool $all_wilayas,
        public bool $all_products,
        public array|Optional $wilaya_ids,
        public array|Optional $product_ids,
        public ?string $remark,
        public bool $active,
        public bool $has_related_data,
    ) {}

    public static function fromWarehouse(Warehouse $warehouse, bool $withIds = false): self
    {
        return new self(
            id: $warehouse->id,
            name: $warehouse->name,
            phone: $warehouse->phone,
            address: $warehouse->address,
            all_wilayas: (bool) $warehouse->all_wilayas,
            all_products: (bool) $warehouse->all_products,
            wilaya_ids: $withIds ? $warehouse->wilayas->pluck('id')->values()->all() : new Optional(),
            product_ids: $withIds ? $warehouse->products->pluck('id')->values()->all() : new Optional(),
            remark: $warehouse->remark,
            active: (bool) $warehouse->active,
            has_related_data: $warehouse->products->isNotEmpty() || $warehouse->stock_movements_count > 0,
        );
    }
}
