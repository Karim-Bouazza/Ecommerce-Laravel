<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $stockInterne = (int) $this->stock_in - (int) $this->stock_out;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
            'stock_interne' => $stockInterne,
            'stock_reserve' => (int) $this->reserved_quantity,
            'stock_en_livraison' => (int) $this->in_delivery_quantity,
            'stock_en_retour' => (int) $this->in_return_quantity,
            'confirme_sans_stock' => (int) $this->confirmed_no_stock_quantity,
            'vendu' => (int) $this->sold_quantity,
            'purchase_price' => $this->purchase_price,
            'valeur_du_stock' => $this->purchase_price !== null ? $stockInterne * $this->purchase_price : null,
            'valeur_en_livraison' => (int) $this->in_delivery_value,
        ];
    }
}
