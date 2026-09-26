<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackagePriceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'insurance_value' => $this['insurance_value'],
            'extra_weight_price' => $this['extra_weight_price'],
            'delivery_price' => $this['delivery_price'],
            'total_price' => $this['total_price'],
            'price_to_pay' => $this['price_to_pay'],
        ];
    }
}
