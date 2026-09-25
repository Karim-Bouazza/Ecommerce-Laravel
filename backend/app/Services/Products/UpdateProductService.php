<?php

namespace App\Services\Products;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class UpdateProductService
{
    public function execute(Product $product, array $data, ?UploadedFile $image = null): Product
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
            'is_active',
            'is_new',
        ]));

        if ($image) {
            $previousImage = $product->image_1;
            $product->update(['image_1' => $image->store('products', 'public')]);

            if ($previousImage) {
                Storage::disk('public')->delete($previousImage);
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
