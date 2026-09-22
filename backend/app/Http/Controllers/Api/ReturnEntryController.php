<?php

namespace App\Http\Controllers\Api;

use App\Enums\PurchaseEntryStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReturnEntryRequest;
use App\Http\Requests\StoreReturnEntryVersementRequest;
use App\Http\Requests\UpdateReturnEntryRequest;
use App\Http\Resources\ReturnEntryResource;
use App\Http\Resources\ReturnEntryVersementResource;
use App\Models\PurchaseEntry;
use App\Models\ReturnEntry;
use App\Models\ReturnEntryItem;
use App\Services\ReturnEntries\ConfirmReturnEntryService;
use App\Services\ReturnEntries\CreateReturnEntryService;
use App\Services\ReturnEntries\CreateReturnEntryVersementService;
use App\Services\ReturnEntries\DeleteReturnEntryService;
use App\Services\ReturnEntries\UpdateReturnEntryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class ReturnEntryController extends Controller
{
    protected const WITH = ['purchaseEntry', 'warehouse', 'fournisseur', 'items.product'];

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('entrees_retour.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $entries = ReturnEntry::query()
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

        return ReturnEntryResource::collection($entries);
    }

    public function store(StoreReturnEntryRequest $request): ReturnEntryResource|JsonResponse
    {
        try {
            $entry = app(CreateReturnEntryService::class)->execute($request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ReturnEntryResource($entry->fresh(self::WITH));
    }

    public function update(UpdateReturnEntryRequest $request, ReturnEntry $returnEntry): ReturnEntryResource|JsonResponse
    {
        try {
            app(UpdateReturnEntryService::class)->execute($returnEntry, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ReturnEntryResource($returnEntry->fresh(self::WITH));
    }

    public function confirm(ReturnEntry $returnEntry): ReturnEntryResource|JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrees_retour.edit'), 403);

        try {
            app(ConfirmReturnEntryService::class)->execute($returnEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ReturnEntryResource($returnEntry->fresh(self::WITH));
    }

    public function destroy(ReturnEntry $returnEntry): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrees_retour.delete'), 403);

        try {
            app(DeleteReturnEntryService::class)->execute($returnEntry);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(null, 204);
    }

    public function createVersement(
        StoreReturnEntryVersementRequest $request,
        ReturnEntry $returnEntry
    ): ReturnEntryResource|JsonResponse {
        try {
            app(CreateReturnEntryVersementService::class)->execute($returnEntry, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return new ReturnEntryResource($returnEntry->fresh(self::WITH));
    }

    public function versements(ReturnEntry $returnEntry): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('versements.view'), 403);

        $versements = $returnEntry->versements()
            ->with('wallet')
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return ReturnEntryVersementResource::collection($versements);
    }

    public function purchaseEntryOptions(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('entrees_retour.view'), 403);

        $options = PurchaseEntry::query()
            ->where('status', PurchaseEntryStatus::Completed)
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
        abort_unless(auth()->user()->hasPermission('entrees_retour.view'), 403);

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
