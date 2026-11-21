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
        ]);

        foreach ([1, 2, 3, 4] as $imageNumber) {
            $product->setImage($data->{"image_{$imageNumber}"}, "image_{$imageNumber}");
        }

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
