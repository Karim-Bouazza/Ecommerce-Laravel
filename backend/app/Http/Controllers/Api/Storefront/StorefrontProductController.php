<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Data\Storefront\StorefrontProductData;
use App\Data\Storefront\StorefrontProductDetailData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use App\Models\Inventory\Stock;
use App\Support\Query\Filters\CompareFilter;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;

class StorefrontProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = QueryBuilder::for(
            $this->baseQuery(),
            ListQuery::request($request, ['search', 'category_id', 'is_new', 'price_min', 'price_max', 'in_stock']),
        )
            ->allowedFilters(
                AllowedFilter::exact('category_id'),
                AllowedFilter::custom('search', new SearchFilter(['name'])),
                AllowedFilter::callback('is_new', fn ($query, $value) => filter_var($value, FILTER_VALIDATE_BOOLEAN)
                    ? $query->where('is_new', true)
                    : $query),
                AllowedFilter::custom('price_min', CompareFilter::min('price')),
                AllowedFilter::custom('price_max', CompareFilter::max('price')),
                AllowedFilter::callback('in_stock', fn ($query, $value) => $query->having(
                    'total_stock',
                    filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '>' : '<=',
                    0,
                )),
            )
            ->allowedSorts(
                AllowedSort::callback('price_asc', fn ($query) => $query->orderBy('price')),
                AllowedSort::callback('price_desc', fn ($query) => $query->orderByDesc('price')),
                AllowedSort::callback('newest', fn ($query) => $query->orderByDesc('is_new')->orderByDesc('created_at')),
            )
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request, 20))
            ->withQueryString();

        $priceBounds = Product::query()
            ->where('is_active', true)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        $products->through(fn (Product $product) => StorefrontProductData::fromProduct($product));

        return response()->json([
            ...StorefrontProductData::collect($products, PaginatedDataCollection::class)->toArray(),
            'price_bounds' => [
                'min' => (int) ($priceBounds->min_price ?? 0),
                'max' => (int) ($priceBounds->max_price ?? 0),
            ],
        ]);
    }

    public function deals(Request $request): DataCollection
    {
        $limit = (int) $request->input('limit', 10);
        $limit = max(1, min($limit, 20));

        $products = $this->baseQuery()
            ->whereNotNull('products.compare_price')
            ->whereColumn('products.compare_price', '>', 'products.price')
            ->orderByRaw('(products.compare_price - products.price) / products.compare_price DESC')
            ->orderByDesc('products.created_at')
            ->limit($limit)
            ->get();

        return StorefrontProductData::collect($products, DataCollection::class);
    }

    public function show(string $product): StorefrontProductDetailData
    {
        // One query instead of route-model-binding + reload. baseQuery()
        // already filters is_active, so an inactive/missing product is a 404.
        $product = $this->baseQuery((int) $product)
            ->where('products.id', (int) $product)
            ->firstOrFail();

        return StorefrontProductDetailData::fromProduct($product);
    }

    /**
     * @param  int|null  $productId  Restricts the stock aggregation to a single
     *                               product, so a detail page doesn't sum the
     *                               stock movements of the whole catalogue.
     */
    protected function baseQuery(?int $productId = null)
    {
        $stockTotals = Stock::totalSubquery()
            ->when($productId !== null, fn ($query) => $query->where('product_id', $productId));

        return Product::query()
            ->where('is_active', true)
            ->with(['category', 'specs', 'variants', 'media'])
            ->leftJoinSub($stockTotals, 'stock_totals', 'stock_totals.product_id', '=', 'products.id')
            ->select('products.*')
            ->selectRaw('COALESCE(stock_totals.total_quantity, 0) as total_stock');
    }
}
