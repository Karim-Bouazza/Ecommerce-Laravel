<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorefrontProductDetailResource;
use App\Http\Resources\StorefrontProductResource;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;

class StorefrontProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 20);
        $sort = $request->input('sort');
        $categoryIds = array_filter(explode(',', (string) $request->input('category_id', '')));

        $products = $this->baseQuery()
            ->when(count($categoryIds) > 0, fn ($query) => $query->whereIn('category_id', $categoryIds))
            ->when($request->filled('search'), fn ($query) => $query->where('name', 'like', '%'.$request->input('search').'%'))
            ->when($request->boolean('is_new'), fn ($query) => $query->where('is_new', true))
            ->when($request->filled('price_min'), fn ($query) => $query->where('price', '>=', (int) $request->input('price_min')))
            ->when($request->filled('price_max'), fn ($query) => $query->where('price', '<=', (int) $request->input('price_max')))
            ->when($request->has('in_stock'), fn ($query) => $query->having('total_stock', $request->boolean('in_stock') ? '>' : '<=', 0))
            ->when($sort === 'price_asc', fn ($query) => $query->orderBy('price'))
            ->when($sort === 'price_desc', fn ($query) => $query->orderByDesc('price'))
            ->when($sort === 'newest', fn ($query) => $query->orderByDesc('is_new')->orderByDesc('created_at'))
            ->when(!in_array($sort, ['price_asc', 'price_desc', 'newest'], true), fn ($query) => $query->orderByDesc('created_at'))
            ->paginate($perPage)
            ->withQueryString();

        $priceBounds = Product::query()
            ->where('is_active', true)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return StorefrontProductResource::collection($products)->additional([
            'price_bounds' => [
                'min' => (int) ($priceBounds->min_price ?? 0),
                'max' => (int) ($priceBounds->max_price ?? 0),
            ],
        ]);
    }

    public function show(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $product = $this->baseQuery()
            ->where('products.id', $product->id)
            ->firstOrFail();

        return new StorefrontProductDetailResource($product);
    }

    protected function baseQuery()
    {
        return Product::query()
            ->where('is_active', true)
            ->with(['category', 'brand', 'tags', 'specs', 'variants'])
            ->leftJoinSub(Stock::totalSubquery(), 'stock_totals', 'stock_totals.product_id', '=', 'products.id')
            ->select('products.*')
            ->selectRaw('COALESCE(stock_totals.total_quantity, 0) as total_stock')
            ->withCount('approvedReviews as reviews_count')
            ->withAvg('approvedReviews as rating_avg', 'rating');
    }
}
