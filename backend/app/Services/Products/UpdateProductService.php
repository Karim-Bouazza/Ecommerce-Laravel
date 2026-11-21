<?php

namespace App\Services\Products;

use App\Data\Catalog\UpdateProductData;
use App\Models\Catalog\Product;
use Spatie\LaravelData\Optional;

class UpdateProductService
{
    public function execute(Product $product, UpdateProductData $data): Product
    {
        $product->update($data->only(
            'category_id',
            'sku',
            'name',
            'description',
            'short_description',
            'purchase_price',
            'price',
            'compare_price',
            'is_active',
            'is_new',
        )->toArray());

        foreach ([1, 2, 3, 4] as $imageNumber) {
            $collection = "image_{$imageNumber}";
            $upload = $data->{$collection};

            if ($upload !== null) {
                $product->setImage($upload, $collection);
            } elseif (in_array($imageNumber, $data->remove_images)) {
                $product->removeImage($collection);
            }
        }

        if (! $data->specs instanceof Optional) {
            $product->specs()->delete();

            foreach ($data->specs as $index => $spec) {
                $product->specs()->create([
                    'label' => $spec->label,
                    'value' => $spec->value,
                    'sort_order' => $index,
                ]);
            }
        }

        if (! $data->variants instanceof Optional) {
            $product->variants()->delete();

            foreach ($data->variants as $index => $label) {
                $product->variants()->create([
                    'label' => $label,
                    'sort_order' => $index,
                ]);
            }
        }

        return $product;
    }
}
