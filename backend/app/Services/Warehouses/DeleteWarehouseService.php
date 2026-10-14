<?php

namespace App\Services\Warehouses;

use App\Models\Inventory\Warehouse;

class DeleteWarehouseService
{
    public function execute(Warehouse $warehouse): void
    {
        $warehouse->delete();
    }
}
