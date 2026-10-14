<?php

namespace App\Services\Products;

use App\Models\Catalog\Product;

class DeleteProductService
{
    public function execute(Product $product): void
    {
        $product->delete();
    }
}
