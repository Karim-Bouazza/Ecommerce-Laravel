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
            'name',
            'description',
            'purchase_price',
            'price',
            'is_active',
        ]));

        if ($image) {
            $previousImage = $product->image_1;
            $product->update(['image_1' => $image->store('products', 'public')]);

            if ($previousImage) {
                Storage::disk('public')->delete($previousImage);
            }
        }

        return $product;
    }
}
