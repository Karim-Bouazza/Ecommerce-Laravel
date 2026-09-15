<?php

namespace App\Http\Controllers\Api;

use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustStockRequest;
use App\Http\Resources\StockResource;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use App\Services\Warehouses\UpdateWarehouseStockService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('stock.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));
        $warehouseId = $request->input('warehouse_id');
        $purchasePriceMin = $request->input('purchase_price_min');
        $purchasePriceMax = $request->input('purchase_price_max');
        $stockInterneMin = $request->input('stock_interne_min');
        $stockInterneMax = $request->input('stock_interne_max');

        $products = $this->withStockSums(Product::query(), $warehouseId)
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
            ->when(
                $purchasePriceMin !== null,
                fn (Builder $query) => $query->where('purchase_price', '>=', $purchasePriceMin)
            )
            ->when(
                $purchasePriceMax !== null,
                fn (Builder $query) => $query->where('purchase_price', '<=', $purchasePriceMax)
            )
            ->when(
                $stockInterneMin !== null,
                fn (Builder $query) => $query->havingRaw(
                    'COALESCE(stock_in, 0) - COALESCE(stock_out, 0) >= ?',
                    [$stockInterneMin]
                )
            )
            ->when(
                $stockInterneMax !== null,
                fn (Builder $query) => $query->havingRaw(
                    'COALESCE(stock_in, 0) - COALESCE(stock_out, 0) <= ?',
                    [$stockInterneMax]
                )
            )
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return StockResource::collection($products);
    }

    public function adjust(AdjustStockRequest $request, Product $product): StockResource
    {
        $warehouse = Warehouse::findOrFail($request->validated('warehouse_id'));

        $stockMinimum = (int) (DB::table('warehouse_product')
            ->where('warehouse_id', $warehouse->id)
            ->where('product_id', $product->id)
            ->value('stock_minimum') ?? 0);

        app(UpdateWarehouseStockService::class)->execute(
            $warehouse,
            $product,
            (int) $request->validated('adjustment'),
            (float) $request->validated('purchase_price'),
            $stockMinimum,
        );

        $updated = $this->withStockSums(Product::query()->whereKey($product->id), $warehouse->id)->firstOrFail();

        return new StockResource($updated);
    }

    private function withStockSums(Builder $query, mixed $warehouseId): Builder
    {
        return $query
            ->select(['id', 'name', 'image_1', 'purchase_price'])
            ->withSum(['stockMovements as stock_in' => function ($query) use ($warehouseId) {
                $query->where('type', StockMovementType::In)
                    ->when($warehouseId, fn ($query) => $query->where('warehouse_id', $warehouseId));
            }], 'quantity')
            ->withSum(['stockMovements as stock_out' => function ($query) use ($warehouseId) {
                $query->where('type', StockMovementType::Out)
                    ->when($warehouseId, fn ($query) => $query->where('warehouse_id', $warehouseId));
            }], 'quantity')
            ->withSum(['orderItems as reserved_quantity' => Stock::reservedItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as in_delivery_quantity' => Stock::inDeliveryItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as in_delivery_value' => Stock::inDeliveryItemsQuery($warehouseId)], 'total_price')
            ->withSum(['orderItems as in_return_quantity' => Stock::inReturnItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as confirmed_no_stock_quantity' => Stock::confirmedNoStockItemsQuery($warehouseId)], 'quantity')
            ->withSum(['orderItems as sold_quantity' => Stock::soldItemsQuery($warehouseId)], 'quantity');
    }
}
