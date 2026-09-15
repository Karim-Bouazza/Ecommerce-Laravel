<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $viewingWarehouseId = (int) $request->query('warehouse_id', 0);

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'type' => $viewingWarehouseId
                ? ((int) $this->to_warehouse_id === $viewingWarehouseId ? 'in' : 'out')
                : null,
            'from_warehouse' => $this->whenLoaded('fromWarehouse', fn () => [
                'id' => $this->fromWarehouse->id,
                'name' => $this->fromWarehouse->name,
            ]),
            'to_warehouse' => $this->whenLoaded('toWarehouse', fn () => [
                'id' => $this->toWarehouse->id,
                'name' => $this->toWarehouse->name,
            ]),
            'remark' => $this->remark,
            'items' => TransferItemResource::collection($this->whenLoaded('items')),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'creator_name' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'confirmed_at' => $this->confirmed_at,
            'created_at' => $this->created_at,
        ];
    }
}
