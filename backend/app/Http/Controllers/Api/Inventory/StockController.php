<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Data\Inventory\AdjustStockData;
use App\Data\Inventory\StockData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use App\Models\Inventory\Warehouse;
use App\Services\Warehouses\UpdateWarehouseStockService;
use App\Support\Query\Filters\CompareFilter;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class StockController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $products = $this->filteredQuery($request)
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        return StockData::collect($products, PaginatedDataCollection::class);
    }

    public function stats(Request $request): JsonResponse
    {
        $totals = $this->filteredQuery($request)->get()->reduce(
            fn (array $totals, Product $product) => [
                'confirme_sans_stock' => $totals['confirme_sans_stock'] + $product->confirme_sans_stock,
                'valeur_du_stock' => $totals['valeur_du_stock'] + ($product->valeur_du_stock ?? 0),
                'valeur_en_livraison' => $totals['valeur_en_livraison'] + $product->valeur_en_livraison,
            ],
            ['confirme_sans_stock' => 0, 'valeur_du_stock' => 0, 'valeur_en_livraison' => 0],
        );

        return response()->json($totals);
    }

    private function filteredQuery(Request $request): QueryBuilder
    {
        $warehouseId = $request->query('warehouse_id') ?: null;

        return QueryBuilder::for(
            Product::query()->withStockSums($warehouseId),
            ListQuery::request($request, [
                'search',
                'warehouse_id',
                'purchase_price_min',
                'purchase_price_max',
                'stock_interne_min',
                'stock_interne_max',
            ]),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['name'])),
                AllowedFilter::callback('warehouse_id', fn () => null),
                AllowedFilter::custom('purchase_price_min', CompareFilter::min('purchase_price')),
                AllowedFilter::custom('purchase_price_max', CompareFilter::max('purchase_price')),
                AllowedFilter::custom('stock_interne_min', CompareFilter::min(Product::stockInterneSql())),
                AllowedFilter::custom('stock_interne_max', CompareFilter::max(Product::stockInterneSql())),
            )
            ->allowedSorts('name', 'price', 'purchase_price', 'created_at')
            ->defaultSort('name');
    }

    public function adjust(AdjustStockData $data, Product $product): StockData
    {
        $warehouse = Warehouse::findOrFail($data->warehouse_id);

        app(UpdateWarehouseStockService::class)->execute($warehouse, $product, $data);

        $updated = Product::query()->whereKey($product->id)->withStockSums($warehouse->id)->firstOrFail();

        return StockData::from($updated);
    }
}
