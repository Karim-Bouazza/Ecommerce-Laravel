<?php

namespace App\Services\Warehouses;

use App\Models\Warehouse;
use Illuminate\Support\Arr;

class UpdateWarehouseService
{
    public function execute(Warehouse $warehouse, array $data): Warehouse
    {
        $warehouse->update(Arr::only($data, [
            'name',
            'phone',
            'remark',
            'address',
            'all_wilayas',
            'all_products',
            'active',
        ]));

        if (array_key_exists('all_wilayas', $data) || array_key_exists('wilaya_ids', $data)) {
            $warehouse->wilayas()->sync($warehouse->all_wilayas ? [] : ($data['wilaya_ids'] ?? []));
        }

        if (array_key_exists('all_products', $data) || array_key_exists('product_ids', $data)) {
            $warehouse->products()->sync($warehouse->all_products ? [] : ($data['product_ids'] ?? []));
        }

        return $warehouse;
    }
}
