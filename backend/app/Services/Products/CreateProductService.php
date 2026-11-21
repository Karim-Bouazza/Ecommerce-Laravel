<?php

namespace App\Services\Products;

use App\Data\Catalog\StoreProductData;
use App\Models\Catalog\Product;

class CreateProductService
{
    public function execute(StoreProductData $data): Product
    {
        $product = Product::create([
            'category_id' => $data->category_id,
            'sku' => $data->sku,
            'name' => $data->name,
            'description' => $data->description,
            'short_description' => $data->short_description,
            'purchase_price' => $data->purchase_price,
            'price' => $data->price,
            'compare_price' => $data->compare_price,
            'is_active' => $data->is_active,
            'is_new' => $data->is_new,
            'image_1' => $data->image_1->store('products', 'public'),
            'image_2' => $data->image_2?->store('products', 'public'),
            'image_3' => $data->image_3?->store('products', 'public'),
            'image_4' => $data->image_4?->store('products', 'public'),
        ]);

        foreach ($data->specs as $index => $spec) {
            $product->specs()->create([
                'label' => $spec->label,
                'value' => $spec->value,
                'sort_order' => $index,
            ]);
        }

        foreach ($data->variants as $index => $label) {
            $product->variants()->create([
                'label' => $label,
                'sort_order' => $index,
            ]);
        }

        return $product;
    }
}
