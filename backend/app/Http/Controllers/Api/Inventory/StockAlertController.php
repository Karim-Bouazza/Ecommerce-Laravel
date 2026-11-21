<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Data\Inventory\StockAlertData;
use App\Models\Catalog\Product;
use App\Models\Inventory\Stock;
use App\Models\Inventory\Warehouse;
use App\Services\Warehouses\WarehouseStockQueryService;
use App\Support\Query\Filters\CompareFilter;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class StockAlertController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $warehouse = Warehouse::findOrFail($request->input('warehouse_id'));

        $products = QueryBuilder::for(
            app(WarehouseStockQueryService::class)->lowStockQuery($warehouse),
            ListQuery::request($request, ['search', 'warehouse_id', 'purchase_price_min', 'purchase_price_max', 'stock_interne_min', 'stock_interne_max']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['products.name'])),
                AllowedFilter::callback('warehouse_id', fn () => null),
                AllowedFilter::custom('purchase_price_min', CompareFilter::min('products.purchase_price')),
                AllowedFilter::custom('purchase_price_max', CompareFilter::max('products.purchase_price')),
                AllowedFilter::custom('stock_interne_min', CompareFilter::min('coalesce(stock_ledger.available_quantity, 0)')),
                AllowedFilter::custom('stock_interne_max', CompareFilter::max('coalesce(stock_ledger.available_quantity, 0)')),
            )
            ->allowedSorts('products.name', 'products.purchase_price')
            ->withSum(['orderItems as reserved_quantity' => Stock::reservedItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as in_delivery_quantity' => Stock::inDeliveryItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as in_return_quantity' => Stock::inReturnItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as sold_quantity' => Stock::soldItemsQuery($warehouse->id)], 'quantity')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $products->through(fn (Product $product) => StockAlertData::fromProduct($product));

        return StockAlertData::collect($products, PaginatedDataCollection::class);
    }
}
