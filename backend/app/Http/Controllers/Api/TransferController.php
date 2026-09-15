<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransferRequest;
use App\Http\Resources\TransferResource;
use App\Models\WarehouseTransfer;
use App\Services\Transfers\ConfirmTransferService;
use App\Services\Transfers\CreateTransferService;
use App\Services\Transfers\DeleteTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class TransferController extends Controller
{
    protected const WITH = ['fromWarehouse', 'toWarehouse', 'items.product', 'creator'];

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('transferts.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));
        $warehouseId = $request->input('warehouse_id');

        $transfers = WarehouseTransfer::query()
            ->with(self::WITH)
            ->when($warehouseId, function ($query) use ($warehouseId) {
                $query->where(function ($query) use ($warehouseId) {
                    $query->where('from_warehouse_id', $warehouseId)
                        ->orWhere('to_warehouse_id', $warehouseId);
                });
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('items.product', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return TransferResource::collection($transfers);
    }

    public function store(StoreTransferRequest $request): TransferResource
    {
        $transfer = app(CreateTransferService::class)->execute($request->validated());

        return new TransferResource($transfer->fresh(self::WITH));
    }

    public function confirm(WarehouseTransfer $transfer): TransferResource|JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('transferts.edit'), 403);

        try {
            app(ConfirmTransferService::class)->execute($transfer);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new TransferResource($transfer->fresh(self::WITH));
    }

    public function destroy(WarehouseTransfer $transfer): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('transferts.delete'), 403);

        try {
            app(DeleteTransferService::class)->execute($transfer);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Transfert supprimé.']);
    }
}
