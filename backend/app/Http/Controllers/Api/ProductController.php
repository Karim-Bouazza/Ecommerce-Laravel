<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\Products\CreateProductService;
use App\Services\Products\DeleteProductService;
use App\Services\Products\UpdateProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 20);
        $search = trim((string) $request->input('search', ''));

        $products = Product::query()
            ->with('category')
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->paginate($perPage);

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        return new ProductDetailResource($product);
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $product = app(CreateProductService::class)->execute($request->validated(), $request->file('image'));

        return new ProductResource($product->load('category'));
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $product = app(UpdateProductService::class)->execute($product, $request->validated(), $request->file('image'));

        return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('products.delete'), 403);

        app(DeleteProductService::class)->execute($product);

        return response()->json(['message' => 'Produit supprimé.']);
    }
}
