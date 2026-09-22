<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseEntryRequest;
use App\Http\Requests\StorePurchaseEntryVersementRequest;
use App\Http\Requests\UpdatePurchaseEntryRequest;
use App\Http\Resources\PurchaseEntryResource;
use App\Http\Resources\PurchaseEntryVersementResource;
use App\Models\PurchaseEntry;
use App\Services\PurchaseEntries\ConfirmPurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryService;
use App\Services\PurchaseEntries\CreatePurchaseEntryVersementService;
use App\Services\PurchaseEntries\DeletePurchaseEntryService;
use App\Services\PurchaseEntries\UpdatePurchaseEntryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class PurchaseEntryController extends Controller
{
    protected const WITH = ['warehouse', 'fournisseur', 'items.product'];

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('entrees_achat.view'), 403);

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

        return PurchaseEntryResource::collection($entries);
    }

    public function store(StorePurchaseEntryRequest $request): PurchaseEntryResource
    {
        $entry = app(CreatePurchaseEntryService::class)->execute($request->validated());

        return new PurchaseEntryResource($entry->fresh(self::WITH));
    }

    public function update(UpdatePurchaseEntryRequest $request, PurchaseEntry $purchaseEntry): PurchaseEntryResource|JsonResponse
    {
        try {
            app(UpdatePurchaseEntryService::class)->execute($purchaseEntry, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new PurchaseEntryResource($purchaseEntry->fresh(self::WITH));
    }

    public function confirm(PurchaseEntry $purchaseEntry): PurchaseEntryResource|JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrees_achat.edit'), 403);

        try {
            app(ConfirmPurchaseEntryService::class)->execute($purchaseEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new PurchaseEntryResource($purchaseEntry->fresh(self::WITH));
    }

    public function destroy(PurchaseEntry $purchaseEntry): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrees_achat.delete'), 403);

        try {
            app(DeletePurchaseEntryService::class)->execute($purchaseEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(null, 204);
    }

    public function createVersement(
        StorePurchaseEntryVersementRequest $request,
        PurchaseEntry $purchaseEntry
    ): PurchaseEntryResource|JsonResponse {
        try {
            app(CreatePurchaseEntryVersementService::class)->execute($purchaseEntry, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new PurchaseEntryResource($purchaseEntry->fresh(self::WITH));
    }

    public function versements(PurchaseEntry $purchaseEntry): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('versements.view'), 403);

        $versements = $purchaseEntry->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return PurchaseEntryVersementResource::collection($versements);
    }
}
