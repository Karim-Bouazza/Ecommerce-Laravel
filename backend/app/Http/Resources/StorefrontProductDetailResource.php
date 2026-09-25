<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StorefrontProductDetailResource extends JsonResource
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
            'sku' => $this->sku,
            'name' => $this->name,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => $this->category?->name),
            'brand' => $this->whenLoaded('brand', fn () => $this->brand?->name),
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('name')->values()),
            'specs' => $this->whenLoaded('specs', fn () => $this->specs->map(fn ($spec) => [
                'label' => $spec->label,
                'value' => $spec->value,
            ])->values()),
            'variants' => $this->whenLoaded('variants', fn () => $this->variants->map(fn ($variant) => [
                'id' => $variant->id,
                'label' => $variant->label,
            ])->values()),
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'discount_percentage' => $hasDiscount
                ? (int) round((1 - $this->price / $this->compare_price) * 100)
                : null,
            'is_new' => $this->is_new,
            'in_stock' => (int) $this->total_stock > 0,
            'stock' => (int) $this->total_stock,
            'rating_avg' => $this->rating_avg !== null ? round((float) $this->rating_avg, 1) : null,
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'images' => collect([$this->image_1, $this->image_2, $this->image_3, $this->image_4])
                ->filter()
                ->values()
                ->map(fn (string $path) => Storage::url($path)),
        ];
    }
}
