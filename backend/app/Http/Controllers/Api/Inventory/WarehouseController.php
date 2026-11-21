<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Data\Inventory\SaveWarehouseData;
use App\Data\Inventory\WarehouseData;
use App\Models\Inventory\Warehouse;
use App\Services\Warehouses\CreateWarehouseService;
use App\Services\Warehouses\DeleteWarehouseService;
use App\Services\Warehouses\ToggleWarehouseActiveService;
use App\Services\Warehouses\UpdateWarehouseService;
use Illuminate\Http\JsonResponse;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class WarehouseController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $warehouses = QueryBuilder::for(
            Warehouse::query()->with(['wilayas:id', 'products:id'])->withCount('stockMovements'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['name', 'phone', 'address', 'remark'])),
            )
            ->allowedSorts('name', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        return WarehouseData::collect($warehouses, PaginatedDataCollection::class);
    }

    public function store(SaveWarehouseData $data): WarehouseData
    {
        $warehouse = app(CreateWarehouseService::class)->execute($data);

        return WarehouseData::fromWarehouse($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function update(SaveWarehouseData $data, Warehouse $warehouse): WarehouseData
    {
        $warehouse = app(UpdateWarehouseService::class)->execute($warehouse, $data);

        return WarehouseData::fromWarehouse($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function toggleActive(Warehouse $warehouse): WarehouseData
    {
        $warehouse = app(ToggleWarehouseActiveService::class)->execute($warehouse);

        return WarehouseData::fromWarehouse($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function destroy(Warehouse $warehouse): JsonResponse
    {
        app(DeleteWarehouseService::class)->execute($warehouse);

        return response()->json(['message' => 'Entrepôt supprimé.']);
    }
}
