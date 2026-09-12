<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'all_wilayas' => (bool) $this->all_wilayas,
            'all_products' => (bool) $this->all_products,
            'wilaya_ids' => $this->wilayas->pluck('id'),
            'product_ids' => $this->products->pluck('id'),
            'remark' => $this->remark,
            'active' => (bool) $this->active,
            'has_related_data' => $this->products->isNotEmpty() || $this->stock_movements_count > 0,
        ];
    }
}
