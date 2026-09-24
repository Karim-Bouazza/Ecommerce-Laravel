<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StorefrontHeroCategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'position' => $this->position,
            'image_url' => $this->image_url,
            'category_id' => $this->category_id,
            'category_name' => $this->category->name,
            'item_count' => $this->category->products_count ?? $this->category->products()->count(),
        ];
    }
}
