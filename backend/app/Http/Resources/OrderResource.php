<?php

namespace App\Http\Resources;

use App\Enums\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,

            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'status_color' => $this->status->color(),
            'is_editable' => $this->status->isEditable(),
            'status_transitions' => collect($this->status->allowedTransitions())
                ->reject(fn (OrderStatus $status) => $status === OrderStatus::Scheduled)
                ->map(fn (OrderStatus $status) => ['value' => $status->value, 'label' => $status->label()])
                ->values(),

            'payment_status' => $this->payment_status->value,
            'payment_status_label' => $this->payment_status->label(),

            'type' => $this->type->value,
            'type_label' => $this->type->label(),

            'delivery_type' => $this->delivery_type->value,
            'delivery_type_label' => $this->delivery_type->label(),
            'stop_desk_company_id' => $this->stop_desk_company_id,
            'stop_desk_company_name' => $this->stopDeskCompany?->name,

            'client_id' => $this->client_id,
            'first_name' => $this->client?->first_name,
            'last_name' => $this->client?->last_name,
            'client_name' => trim(($this->client?->first_name ?? '').' '.($this->client?->last_name ?? '')),
            'phone_number' => $this->client?->phone_number,
            'wilaya_id' => $this->client?->wilaya_id,
            'wilaya_name' => $this->client?->wilaya?->name,
            'commune_id' => $this->client?->commune_id,
            'commune_name' => $this->client?->commune?->name,
            'address' => $this->address,
            'provider_wilaya_id' => $this->provider_wilaya_id,
            'provider_commune_id' => $this->provider_commune_id,
            'provider_office_id' => $this->provider_office_id,
            'delivery_note' => $this->delivery_note,
            'name' => $this->name,
            'provider_order_id' => $this->provider_order_id,
            'free_delivery' => (bool) $this->free_delivery,
            'can_be_opened' => (bool) $this->can_be_opened,

            'subtotal' => (int) $this->subtotal,
            'delivery_price' => (int) $this->delivery_price,
            'total_price' => (int) $this->total_price,

            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'status_changed_at' => ($this->latestStatusHistory?->created_at ?? $this->created_at)?->toIso8601String(),

            'items' => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'variant' => $item->variant,
                'warehouse_id' => $item->warehouse_id,
                'warehouse_name' => $item->warehouse?->name,
                'quantity' => $item->quantity,
                'price' => (int) $item->price,
                'total_price' => (int) $item->total_price,
            ])->values(),
        ];
    }
}
