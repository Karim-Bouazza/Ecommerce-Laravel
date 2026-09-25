<?php

namespace App\Services\Products;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class CreateProductService
{
    public function execute(array $data, UploadedFile $image): Product
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
            'is_active' => $data['is_active'] ?? true,
            'is_new' => $data['is_new'] ?? false,
            'image_1' => $image->store('products', 'public'),
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
