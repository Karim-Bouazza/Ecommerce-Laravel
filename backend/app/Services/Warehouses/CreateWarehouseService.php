<?php

namespace App\Services\Warehouses;

use App\Models\Warehouse;

class CreateWarehouseService
{
    public function execute(array $data): Warehouse
    {
        $warehouse = Warehouse::create([
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'remark' => $data['remark'] ?? null,
            'address' => $data['address'] ?? null,
            'all_wilayas' => $data['all_wilayas'] ?? false,
            'all_products' => $data['all_products'] ?? false,
        ]);

        $warehouse->wilayas()->sync($warehouse->all_wilayas ? [] : ($data['wilaya_ids'] ?? []));
        $warehouse->products()->sync($warehouse->all_products ? [] : ($data['product_ids'] ?? []));

        return $warehouse;
    }
}
