<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Data\Inventory\StoreTransferData;
use App\Data\Inventory\TransferData;
use App\Models\Inventory\WarehouseTransfer;
use App\Services\Transfers\ConfirmTransferService;
use App\Services\Transfers\CreateTransferService;
use App\Services\Transfers\DeleteTransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class TransferController extends Controller
{
    protected const WITH = ['fromWarehouse', 'toWarehouse', 'items.product', 'creator'];

    public function index(Request $request): PaginatedDataCollection
    {
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

        $transfers->through(fn (WarehouseTransfer $transfer) => TransferData::fromTransfer($transfer, (int) $warehouseId ?: null));

        return TransferData::collect($transfers, PaginatedDataCollection::class);
    }

    public function store(StoreTransferData $data): TransferData
    {
        $transfer = app(CreateTransferService::class)->execute($data);

        return TransferData::fromTransfer($transfer->fresh(self::WITH));
    }

    public function confirm(WarehouseTransfer $transfer): TransferData|JsonResponse
    {
        try {
            app(ConfirmTransferService::class)->execute($transfer);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return TransferData::fromTransfer($transfer->fresh(self::WITH));
    }

    public function destroy(WarehouseTransfer $transfer): JsonResponse
    {
        try {
            app(DeleteTransferService::class)->execute($transfer);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Transfert supprimé.']);
    }
}
