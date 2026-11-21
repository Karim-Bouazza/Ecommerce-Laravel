<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Data\Inventory\AdjustStockData;
use App\Data\Inventory\StockData;
use App\Models\Catalog\Product;
use App\Models\Inventory\Warehouse;
use App\Services\Warehouses\UpdateWarehouseStockService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class StockController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);

        $products = $this->filteredQuery($request)
            ->orderBy('name')
            ->paginate($perPage)
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

    private function filteredQuery(Request $request): Builder
    {
        $search = trim((string) $request->input('search', ''));
        $warehouseId = $request->input('warehouse_id');
        $purchasePriceMin = $request->input('purchase_price_min');
        $purchasePriceMax = $request->input('purchase_price_max');
        $stockInterneMin = $request->input('stock_interne_min');
        $stockInterneMax = $request->input('stock_interne_max');

        return Product::query()
            ->withStockSums($warehouseId)
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
                fn (Builder $query) => $query->havingRaw(Product::stockInterneSql() . ' >= ?', [$stockInterneMin])
            )
            ->when(
                $stockInterneMax !== null,
                fn (Builder $query) => $query->havingRaw(Product::stockInterneSql() . ' <= ?', [$stockInterneMax])
            );
    }

    public function adjust(AdjustStockData $data, Product $product): StockData
    {
        $warehouse = Warehouse::findOrFail($data->warehouse_id);

        app(UpdateWarehouseStockService::class)->execute($warehouse, $product, $data);

        $updated = Product::query()->whereKey($product->id)->withStockSums($warehouse->id)->firstOrFail();

        return StockData::from($updated);
    }
}
