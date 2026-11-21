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
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $products = QueryBuilder::for(
            Product::query()->with(['category', 'specs', 'variants', 'media']),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(AllowedFilter::custom('search', new SearchFilter(['name'])))
            ->allowedSorts('name', 'price', 'created_at')
            ->paginate(ListQuery::perPage($request, 20))
            ->withQueryString();

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
