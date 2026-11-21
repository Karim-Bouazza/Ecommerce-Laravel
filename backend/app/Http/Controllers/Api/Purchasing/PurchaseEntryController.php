<?php

namespace App\Http\Controllers\Api\Purchasing;

use App\Http\Controllers\Controller;
use App\Data\Purchasing\EntryVersementData;
use App\Data\Purchasing\PurchaseEntryData;
use App\Data\Purchasing\SavePurchaseEntryData;
use App\Data\Purchasing\StoreVersementData;
use App\Models\Purchasing\PurchaseEntry;
use App\Services\PurchaseEntries\ConfirmPurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryVersementService;
use App\Services\PurchaseEntries\DeletePurchaseEntryService;
use App\Services\PurchaseEntries\UpdatePurchaseEntryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;

class PurchaseEntryController extends Controller
{
    protected const WITH = ['warehouse', 'fournisseur', 'items.product'];

    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $entries = PurchaseEntry::query()
            ->with(self::WITH)
            ->withSum('versements as paid_amount_sum', 'amount')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhereHas('fournisseur', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('warehouse', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
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
