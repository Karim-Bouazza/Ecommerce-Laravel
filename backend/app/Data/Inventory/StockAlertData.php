<?php

namespace App\Data\Inventory;

use App\Models\Catalog\Product;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;

class StockAlertData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $image,
        public int $stock_minimum,
        public int $stock_interne,
        public int $stock_reserve,
        public int $stock_en_livraison,
        public int $stock_en_retour,
        public int $vendu,
    ) {}

    public static function fromProduct(Product $product): self
    {
        return new self(
            id: $product->id,
            name: $product->name,
            image: $product->image_1 ? Storage::url($product->image_1) : null,
            stock_minimum: (int) $product->warehouse_stock_minimum,
            stock_interne: (int) $product->warehouse_quantity,
            stock_reserve: (int) $product->reserved_quantity,
            stock_en_livraison: (int) $product->in_delivery_quantity,
            stock_en_retour: (int) $product->in_return_quantity,
            vendu: (int) $product->sold_quantity,
        );
    }
}
