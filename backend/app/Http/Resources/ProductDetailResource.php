<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'description' => $this->description,
            'image_01' => Storage::url($this->image_01),
            'image_02' => Storage::url($this->image_02),
            'image_03' => Storage::url($this->image_03),
            'image_04' => Storage::url($this->image_04),
        ];
    }
}
