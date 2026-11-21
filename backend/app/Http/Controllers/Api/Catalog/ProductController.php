<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Data\Catalog\ProductData;
use App\Data\Catalog\StoreProductData;
use App\Data\Catalog\UpdateProductData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use App\Services\Products\CreateProductService;
use App\Services\Products\DeleteProductService;
use App\Services\Products\UpdateProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class ProductController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 20);
        $search = trim((string) $request->input('search', ''));

        $products = Product::query()
            ->with(['category', 'specs', 'variants'])
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate($perPage);

        $products->through(fn (Product $product) => ProductData::fromProduct($product));

        return ProductData::collect($products, PaginatedDataCollection::class);
    }

    public function store(StoreProductData $data): ProductData
    {
        $product = app(CreateProductService::class)->execute($data);

        return ProductData::fromProduct($product->load(['category', 'specs', 'variants']));
    }

    public function update(UpdateProductData $data, Product $product): ProductData
    {
        $product = app(UpdateProductService::class)->execute($product, $data);

        return ProductData::fromProduct($product->load(['category', 'specs', 'variants']));
    }

    public function destroy(Product $product): JsonResponse
    {
        app(DeleteProductService::class)->execute($product);

        return response()->json(['message' => 'Produit supprimé.']);
    }
}
