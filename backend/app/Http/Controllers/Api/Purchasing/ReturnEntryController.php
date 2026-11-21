<?php

namespace App\Http\Controllers\Api\Purchasing;

use App\Data\Purchasing\EntryVersementData;
use App\Data\Purchasing\ReturnEntryData;
use App\Data\Purchasing\StoreReturnEntryData;
use App\Data\Purchasing\StoreVersementData;
use App\Data\Purchasing\UpdateReturnEntryData;
use App\States\Purchase\Completed;
use App\Http\Controllers\Controller;
use App\Models\Purchasing\PurchaseEntry;
use App\Models\Purchasing\ReturnEntry;
use App\Models\Purchasing\ReturnEntryItem;
use App\Services\ReturnEntries\ConfirmReturnEntryService;
use App\Services\ReturnEntries\CreateReturnEntryService;
use App\Services\ReturnEntries\CreateReturnEntryVersementService;
use App\Services\ReturnEntries\DeleteReturnEntryService;
use App\Services\ReturnEntries\UpdateReturnEntryService;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ReturnEntryController extends Controller
{
    protected const WITH = ['purchaseEntry', 'warehouse', 'fournisseur', 'items.product'];

    public function index(Request $request): PaginatedDataCollection
    {
        $entries = QueryBuilder::for(
            ReturnEntry::query()
                ->with(self::WITH)
                ->withSum('versements as paid_amount_sum', 'amount'),
            ListQuery::request($request, ['search']),
        )
            ->allowedFilters(
                AllowedFilter::custom('search', new SearchFilter(['reference'], ['fournisseur' => ['name'], 'warehouse' => ['name']])),
            )
            ->allowedSorts('reference', 'created_at')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $entries->through(fn (ReturnEntry $entry) => ReturnEntryData::fromEntry($entry));

        return ReturnEntryData::collect($entries, PaginatedDataCollection::class);
    }

    public function store(StoreReturnEntryData $data): ReturnEntryData|JsonResponse
    {
        try {
            $entry = app(CreateReturnEntryService::class)->execute($data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ReturnEntryData::fromEntry($entry->fresh(self::WITH));
    }

    public function update(UpdateReturnEntryData $data, ReturnEntry $returnEntry): ReturnEntryData|JsonResponse
    {
        try {
            app(UpdateReturnEntryService::class)->execute($returnEntry, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ReturnEntryData::fromEntry($returnEntry->fresh(self::WITH));
    }

    public function confirm(ReturnEntry $returnEntry): ReturnEntryData|JsonResponse
    {
        try {
            app(ConfirmReturnEntryService::class)->execute($returnEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ReturnEntryData::fromEntry($returnEntry->fresh(self::WITH));
    }

    public function destroy(ReturnEntry $returnEntry): JsonResponse
    {
        try {
            app(DeleteReturnEntryService::class)->execute($returnEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(null, 204);
    }

    public function createVersement(
        StoreVersementData $data,
        ReturnEntry $returnEntry
    ): ReturnEntryData|JsonResponse {
        try {
            app(CreateReturnEntryVersementService::class)->execute($returnEntry, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return ReturnEntryData::fromEntry($returnEntry->fresh(self::WITH));
    }

    public function versements(ReturnEntry $returnEntry): DataCollection
    {
        $versements = $returnEntry->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return EntryVersementData::collect($versements, DataCollection::class);
    }

    public function purchaseEntryOptions(): JsonResponse
    {
        $options = PurchaseEntry::query()
            ->where('status', Completed::getMorphClass())
            ->with(['warehouse', 'fournisseur'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PurchaseEntry $entry) => [
                'id' => $entry->id,
                'name' => $entry->reference,
                'warehouse_name' => $entry->warehouse?->name,
                'fournisseur_name' => $entry->fournisseur?->name,
            ])
            ->values();

        return response()->json($options);
    }

    public function purchaseEntryItems(Request $request, PurchaseEntry $purchaseEntry): JsonResponse
    {
        $excludeReturnEntryId = $request->integer('exclude_return_entry_id') ?: null;

        $items = $purchaseEntry->items()
            ->with('product')
            ->get();

        $returnedByItemId = ReturnEntryItem::query()
            ->selectRaw('purchase_entry_item_id, sum(quantity) as total')
            ->whereIn('purchase_entry_item_id', $items->pluck('id'))
            ->when($excludeReturnEntryId, fn ($query) => $query->where('return_entry_id', '!=', $excludeReturnEntryId))
            ->groupBy('purchase_entry_item_id')
            ->pluck('total', 'purchase_entry_item_id');

        $items = $items
            ->map(function ($item) use ($returnedByItemId) {
                $returned = (int) ($returnedByItemId[$item->id] ?? 0);

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name,
                    'purchase_price' => $item->purchase_price,
                    'purchased_quantity' => $item->quantity,
                    'returned_quantity' => $returned,
                    'remaining_quantity' => max(0, $item->quantity - $returned),
                ];
            })
            ->values();

        return response()->json($items);
    }
}
