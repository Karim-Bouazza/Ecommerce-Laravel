<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseEntryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'warehouse' => $this->whenLoaded('warehouse', fn () => [
                'id' => $this->warehouse->id,
                'name' => $this->warehouse->name,
            ]),
            'fournisseur' => $this->whenLoaded('fournisseur', fn () => [
                'id' => $this->fournisseur->id,
                'name' => $this->fournisseur->name,
            ]),
            'remark' => $this->remark,
            'items' => PurchaseEntryItemResource::collection($this->whenLoaded('items')),
            'total' => $this->total,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'payment_status' => $this->paymentStatus()->value,
            'payment_status_label' => $this->paymentStatus()->label(),
            'payment_status_color' => $this->paymentStatus()->color(),
            'paid_amount' => $this->paidAmount(),
            'remaining_amount' => $this->remainingAmount(),
            'created_at' => $this->created_at,
        ];
    }
}
