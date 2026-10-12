<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class StorefrontSectionProductResource extends JsonResource
{
    private const SPECS_SHOWN = 3;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->product;
        $hasDiscount = $product->compare_price !== null && $product->compare_price > $product->price;
        $images = collect([$product->image_1, $product->image_2, $product->image_3, $product->image_4])
            ->filter()
            ->values()
            ->map(fn (string $path) => Storage::url($path));

        return [
            'id' => $this->id,
            'position' => $this->position,
            'label' => $this->label,
            'product_id' => $product->id,
            'name' => $product->name,
            'short_description' => $product->short_description,
            'price' => $product->price,
            'compare_price' => $hasDiscount ? $product->compare_price : null,
            'discount_percentage' => $hasDiscount
                ? (int) round((1 - $product->price / $product->compare_price) * 100)
                : null,
            'image' => $images->first(),
            'images' => $images,
            'is_active' => (bool) $product->is_active,
            'specs' => $product->specs->take(self::SPECS_SHOWN)->pluck('value')->values(),
        ];
    }
}
