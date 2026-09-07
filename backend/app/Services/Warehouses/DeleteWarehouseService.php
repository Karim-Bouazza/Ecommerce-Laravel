<?php

namespace App\Services\Warehouses;

use App\Models\Warehouse;

class DeleteWarehouseService
{
    public function execute(Warehouse $warehouse): void
    {
        $warehouse->delete();
    }
}
