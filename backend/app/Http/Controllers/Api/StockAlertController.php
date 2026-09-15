<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockAlertResource;
use App\Models\Stock;
use App\Models\Warehouse;
use App\Services\Warehouses\WarehouseStockQueryService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StockAlertController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('alerte_stock.view'), 403);

        $warehouse = Warehouse::findOrFail($request->input('warehouse_id'));

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));
        $purchasePriceMin = $request->input('purchase_price_min');
        $purchasePriceMax = $request->input('purchase_price_max');
        $stockInterneMin = $request->input('stock_interne_min');
        $stockInterneMax = $request->input('stock_interne_max');

        $products = app(WarehouseStockQueryService::class)
            ->lowStockQuery($warehouse)
            ->when($search !== '', fn (Builder $query) => $query->where('products.name', 'like', "%{$search}%"))
            ->when(
                $purchasePriceMin !== null,
                fn (Builder $query) => $query->where('products.purchase_price', '>=', $purchasePriceMin)
            )
            ->when(
                $purchasePriceMax !== null,
                fn (Builder $query) => $query->where('products.purchase_price', '<=', $purchasePriceMax)
            )
            ->when(
                $stockInterneMin !== null,
                fn (Builder $query) => $query->whereRaw(
                    'coalesce(stock_ledger.available_quantity, 0) >= ?',
                    [$stockInterneMin]
                )
            )
            ->when(
                $stockInterneMax !== null,
                fn (Builder $query) => $query->whereRaw(
                    'coalesce(stock_ledger.available_quantity, 0) <= ?',
                    [$stockInterneMax]
                )
            )
            ->withSum(['orderItems as reserved_quantity' => Stock::reservedItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as in_delivery_quantity' => Stock::inDeliveryItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as in_return_quantity' => Stock::inReturnItemsQuery($warehouse->id)], 'quantity')
            ->withSum(['orderItems as sold_quantity' => Stock::soldItemsQuery($warehouse->id)], 'quantity')
            ->paginate($perPage)
            ->withQueryString();

        return StockAlertResource::collection($products);
    }
}
