<?php

namespace App\Services\Products;

use App\Models\Product;

class CreateProductService
{
    public function execute(array $data, array $images): Product
    {
        $product = Product::create([
            'category_id' => $data['category_id'] ?? null,
            'brand_id' => $data['brand_id'] ?? null,
            'sku' => $data['sku'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'],
            'short_description' => $data['short_description'] ?? null,
            'purchase_price' => $data['purchase_price'] ?? null,
            'price' => $data['price'],
            'compare_price' => $data['compare_price'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'is_new' => $data['is_new'] ?? false,
            'image_1' => $images['image_1']->store('products', 'public'),
            'image_2' => ($images['image_2'] ?? null)?->store('products', 'public'),
            'image_3' => ($images['image_3'] ?? null)?->store('products', 'public'),
            'image_4' => ($images['image_4'] ?? null)?->store('products', 'public'),
        ]);

        $product->tags()->sync($data['tags'] ?? []);

        foreach ($data['specs'] ?? [] as $index => $spec) {
            $product->specs()->create([
                'label' => $spec['label'],
                'value' => $spec['value'],
                'sort_order' => $index,
            ]);
        }

        foreach ($data['variants'] ?? [] as $index => $label) {
            $product->variants()->create([
                'label' => $label,
                'sort_order' => $index,
            ]);
        }

        return $product;
    }
}
