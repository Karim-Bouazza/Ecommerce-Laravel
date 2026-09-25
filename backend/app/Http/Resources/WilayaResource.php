<?php

namespace App\Http\Resources;

use App\Models\Wilaya;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WilayaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'price_domicile' => $this->price_domicile,
            'price_stop_desk' => $this->price_stop_desk,
        ];
    }
}
