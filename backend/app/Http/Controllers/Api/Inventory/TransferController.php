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
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class TransferController extends Controller
{
    protected const WITH = ['fromWarehouse', 'toWarehouse', 'items.product', 'creator'];

    public function index(Request $request): PaginatedDataCollection
    {
        $warehouseId = $request->query('warehouse_id');

        $transfers = QueryBuilder::for(
            WarehouseTransfer::query()->with(self::WITH),
            ListQuery::request($request, ['search', 'warehouse_id']),
        )
            ->allowedFilters(
                AllowedFilter::callback('warehouse_id', fn (Builder $query, $value) => $query->where(
                    fn (Builder $query) => $query->where('from_warehouse_id', $value)->orWhere('to_warehouse_id', $value)
                )),
                AllowedFilter::custom('search', new SearchFilter(['reference'], ['items.product' => ['name']])),
            )
            ->allowedSorts('created_at', 'reference')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
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
