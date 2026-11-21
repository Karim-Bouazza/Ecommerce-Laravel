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
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class WarehouseController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $warehouses = Warehouse::query()
            ->with(['wilayas:id', 'products:id'])
            ->withCount('stockMovements')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%")
                        ->orWhere('remark', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
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
