<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VersementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'date' => $this->date?->format('Y-m-d'),
            'creator_name' => $this->creator?->name,
            'wallet_id' => $this->wallet_id,
            'wallet_name' => $this->wallet?->name,
            'amount' => (int) $this->amount,
            'remark' => $this->remark,
            'type' => 'fournisseur',
            'type_label' => 'Fournisseur de produits',
            'fournisseur_id' => $this->fournisseur_id,
            'fournisseur_name' => $this->fournisseur?->name,
        ];
    }
}
