<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChargeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category->value,
            'category_label' => $this->category->label(),
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'order_trigger' => $this->order_trigger?->value,
            'order_trigger_label' => $this->order_trigger?->label(),
            'recurrence_frequency' => $this->recurrence_frequency?->value,
            'recurrence_frequency_label' => $this->recurrence_frequency?->label(),
            'name' => $this->name,
            'amount' => $this->amount,
            'starts_at' => $this->starts_at?->format('Y-m-d'),
            'ends_at' => $this->ends_at?->format('Y-m-d'),
            'all_products' => (bool) $this->all_products,
            'product_ids' => $this->products->pluck('id'),
            'product_names' => $this->products->pluck('name'),
            'paid_amount' => $this->paidAmount(),
            'remaining_amount' => $this->remainingAmount(),
            'payment_status' => $this->paymentStatus()->value,
            'payment_status_label' => $this->paymentStatus()->label(),
            'payment_status_color' => $this->paymentStatus()->color(),
            'created_at' => $this->created_at,
        ];
    }
}
