<?php

namespace App\Services\Products;

use App\Models\Product;

class DeleteProductService
{
    public function execute(Product $product): void
    {
        $product->delete();
    }
}
