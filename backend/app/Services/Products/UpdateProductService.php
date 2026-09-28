<?php

namespace App\Services\Products;

use App\Models\Product;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class UpdateProductService
{
    public function execute(Product $product, array $data, array $images = []): Product
    {
        $product->update(Arr::only($data, [
            'category_id',
            'brand_id',
            'sku',
            'name',
            'description',
            'short_description',
            'purchase_price',
            'price',
            'compare_price',
            'is_active',
            'is_new',
        ]));

        foreach ([1, 2, 3, 4] as $imageNumber) {
            $field = "image_{$imageNumber}";
            if (isset($images[$field])) {
                $previousImage = $product->{$field};
                $product->update([$field => $images[$field]->store('products', 'public')]);

                if ($previousImage) {
                    Storage::disk('public')->delete($previousImage);
                }
            }
        }

        if (array_key_exists('tags', $data)) {
            $product->tags()->sync($data['tags'] ?? []);
        }

        if (array_key_exists('specs', $data)) {
            $product->specs()->delete();

            foreach ($data['specs'] ?? [] as $index => $spec) {
                $product->specs()->create([
                    'label' => $spec['label'],
                    'value' => $spec['value'],
                    'sort_order' => $index,
                ]);
            }
        }

        if (array_key_exists('variants', $data)) {
            $product->variants()->delete();

            foreach ($data['variants'] ?? [] as $index => $label) {
                $product->variants()->create([
                    'label' => $label,
                    'sort_order' => $index,
                ]);
            }
        }

        return $product;
    }
}
