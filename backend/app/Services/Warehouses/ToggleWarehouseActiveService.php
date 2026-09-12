<?php

namespace App\Services\Warehouses;

use App\Models\Warehouse;

class ToggleWarehouseActiveService
{
    public function execute(Warehouse $warehouse): Warehouse
    {
        $warehouse->update([
            'active' => ! $warehouse->active,
        ]);

        return $warehouse;
    }
}
