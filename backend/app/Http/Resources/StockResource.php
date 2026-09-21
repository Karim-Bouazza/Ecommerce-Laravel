<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
            'stock_interne' => $this->stock_interne,
            'stock_reserve' => $this->stock_reserve,
            'stock_en_livraison' => $this->stock_en_livraison,
            'stock_en_retour' => $this->stock_en_retour,
            'confirme_sans_stock' => $this->confirme_sans_stock,
            'vendu' => $this->vendu,
            'purchase_price' => $this->purchase_price,
            'valeur_du_stock' => $this->valeur_du_stock,
            'valeur_en_livraison' => $this->valeur_en_livraison,
        ];
    }
}
