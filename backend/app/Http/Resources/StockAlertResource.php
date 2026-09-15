<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StockAlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
            'stock_minimum' => (int) $this->warehouse_stock_minimum,
            'stock_interne' => (int) $this->warehouse_quantity,
            'stock_reserve' => (int) $this->reserved_quantity,
            'stock_en_livraison' => (int) $this->in_delivery_quantity,
            'stock_en_retour' => (int) $this->in_return_quantity,
            'vendu' => (int) $this->sold_quantity,
        ];
    }
}
