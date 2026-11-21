<?php

namespace App\Data\Inventory;

use App\Models\Inventory\Warehouse;
use Spatie\LaravelData\Data;

class WarehouseRefData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}

    public static function fromWarehouse(Warehouse $warehouse): self
    {
        return new self($warehouse->id, $warehouse->name);
    }
}
