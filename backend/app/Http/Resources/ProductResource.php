<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
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
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'purchase_price' => $this->purchase_price,
            'price' => $this->price,
            'total_stock' => $this->totalStock(),
            'is_active' => $this->is_active,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
        ];
    }
}
