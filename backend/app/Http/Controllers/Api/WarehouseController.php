<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Http\Resources\WarehouseResource;
use App\Models\Warehouse;
use App\Services\Warehouses\CreateWarehouseService;
use App\Services\Warehouses\DeleteWarehouseService;
use App\Services\Warehouses\ToggleWarehouseActiveService;
use App\Services\Warehouses\UpdateWarehouseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WarehouseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('entrepots.view'), 403);

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

        return WarehouseResource::collection($warehouses);
    }

    public function store(StoreWarehouseRequest $request): WarehouseResource
    {
        $warehouse = app(CreateWarehouseService::class)->execute($request->validated());

        return new WarehouseResource($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): WarehouseResource
    {
        $warehouse = app(UpdateWarehouseService::class)->execute($warehouse, $request->validated());

        return new WarehouseResource($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function toggleActive(Warehouse $warehouse): WarehouseResource
    {
        abort_unless(auth()->user()->hasPermission('entrepots.edit'), 403);

        $warehouse = app(ToggleWarehouseActiveService::class)->execute($warehouse);

        return new WarehouseResource($warehouse->loadCount('stockMovements')->load(['wilayas:id', 'products:id']));
    }

    public function destroy(Warehouse $warehouse): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrepots.delete'), 403);

        app(DeleteWarehouseService::class)->execute($warehouse);

        return response()->json(['message' => 'Entrepôt supprimé.']);
    }
}
