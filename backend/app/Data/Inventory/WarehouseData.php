<?php

namespace App\Data\Inventory;

use App\Models\Inventory\Warehouse;
use Spatie\LaravelData\Data;

class WarehouseData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $phone,
        public ?string $address,
        public bool $all_wilayas,
        public bool $all_products,
        public array $wilaya_ids,
        public array $product_ids,
        public ?string $remark,
        public bool $active,
        public bool $has_related_data,
    ) {}

    public static function fromWarehouse(Warehouse $warehouse): self
    {
        return new self(
            id: $warehouse->id,
            name: $warehouse->name,
            phone: $warehouse->phone,
            address: $warehouse->address,
            all_wilayas: (bool) $warehouse->all_wilayas,
            all_products: (bool) $warehouse->all_products,
            wilaya_ids: $warehouse->wilayas->pluck('id')->values()->all(),
            product_ids: $warehouse->products->pluck('id')->values()->all(),
            remark: $warehouse->remark,
            active: (bool) $warehouse->active,
            has_related_data: $warehouse->products->isNotEmpty() || $warehouse->stock_movements_count > 0,
        );
    }
}
