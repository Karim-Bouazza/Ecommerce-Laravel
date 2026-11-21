<?php

namespace App\Data\Inventory;

use App\Models\Catalog\Product;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;

class StockData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $image,
        public int $stock_interne,
        public int $stock_reserve,
        public int $stock_en_livraison,
        public int $stock_en_retour,
        public int $confirme_sans_stock,
        public int $vendu,
        public mixed $purchase_price,
        public int|float|null $valeur_du_stock,
        public int|float $valeur_en_livraison,
    ) {}

    public static function fromProduct(Product $product): self
    {
        return new self(
            id: $product->id,
            name: $product->name,
            image: $product->image_1 ? Storage::url($product->image_1) : null,
            stock_interne: $product->stock_interne,
            stock_reserve: $product->stock_reserve,
            stock_en_livraison: $product->stock_en_livraison,
            stock_en_retour: $product->stock_en_retour,
            confirme_sans_stock: $product->confirme_sans_stock,
            vendu: $product->vendu,
            purchase_price: $product->purchase_price,
            valeur_du_stock: $product->valeur_du_stock,
            valeur_en_livraison: $product->valeur_en_livraison,
        );
    }
}
