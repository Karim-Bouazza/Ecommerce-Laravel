<?php

namespace App\Http\Controllers\Api\Purchasing;

use App\Data\Purchasing\EntryVersementData;
use App\Data\Purchasing\PurchaseEntryData;
use App\Data\Purchasing\SavePurchaseEntryData;
use App\Data\Purchasing\StoreVersementData;
use App\Http\Controllers\Controller;
use App\Models\Purchasing\PurchaseEntry;
use App\Services\PurchaseEntries\ConfirmPurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryVersementService;
use App\Services\PurchaseEntries\DeletePurchaseEntryService;
use App\Services\PurchaseEntries\UpdatePurchaseEntryService;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class PurchaseEntryController extends Controller
{
    protected const WITH = ['warehouse', 'fournisseur', 'items.product'];

    public function index(Request $request): PaginatedDataCollection
    {
        $entries = QueryBuilder::for(
            PurchaseEntry::query()
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

        $entries->through(fn (PurchaseEntry $entry) => PurchaseEntryData::fromEntry($entry));

        return PurchaseEntryData::collect($entries, PaginatedDataCollection::class);
    }

    public function store(SavePurchaseEntryData $data): PurchaseEntryData
    {
        $entry = app(CreatePurchaseEntryService::class)->execute($data);

        return PurchaseEntryData::fromEntry($entry->fresh(self::WITH));
    }

    public function update(SavePurchaseEntryData $data, PurchaseEntry $purchaseEntry): PurchaseEntryData|JsonResponse
    {
        try {
            app(UpdatePurchaseEntryService::class)->execute($purchaseEntry, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return PurchaseEntryData::fromEntry($purchaseEntry->fresh(self::WITH));
    }

    public function confirm(PurchaseEntry $purchaseEntry): PurchaseEntryData|JsonResponse
    {
        try {
            app(ConfirmPurchaseEntryService::class)->execute($purchaseEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return PurchaseEntryData::fromEntry($purchaseEntry->fresh(self::WITH));
    }

    public function destroy(PurchaseEntry $purchaseEntry): JsonResponse
    {
        try {
            app(DeletePurchaseEntryService::class)->execute($purchaseEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(null, 204);
    }

    public function createVersement(
        StoreVersementData $data,
        PurchaseEntry $purchaseEntry
    ): PurchaseEntryData|JsonResponse {
        try {
            app(CreatePurchaseEntryVersementService::class)->execute($purchaseEntry, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return PurchaseEntryData::fromEntry($purchaseEntry->fresh(self::WITH));
    }

    public function versements(PurchaseEntry $purchaseEntry): DataCollection
    {
        $versements = $purchaseEntry->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return EntryVersementData::collect($versements, DataCollection::class);
    }
}
