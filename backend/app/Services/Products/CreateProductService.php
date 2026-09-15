<?php

namespace App\Services\Products;

use App\Models\Product;
use Illuminate\Http\UploadedFile;

class CreateProductService
{
    public function execute(array $data, UploadedFile $image): Product
    {
        return Product::create([
            'category_id' => $data['category_id'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'],
            'purchase_price' => $data['purchase_price'] ?? null,
            'price' => $data['price'],
            'is_active' => $data['is_active'] ?? true,
            'image_1' => $image->store('products', 'public'),
        ]);
    }
}
