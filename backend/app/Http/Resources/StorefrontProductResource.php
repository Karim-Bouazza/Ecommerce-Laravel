<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StorefrontProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hasDiscount = $this->compare_price !== null && $this->compare_price > $this->price;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'discount_percentage' => $hasDiscount
                ? (int) round((1 - $this->price / $this->compare_price) * 100)
                : null,
            'is_new' => $this->is_new,
            'in_stock' => (int) $this->total_stock > 0,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
        ];
    }
}
