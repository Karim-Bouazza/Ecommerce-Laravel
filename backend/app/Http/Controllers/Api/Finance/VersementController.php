<?php

namespace App\Http\Controllers\Api\Finance;

use App\Enums\Wallet\WalletTransactionCategory;
use App\Http\Controllers\Controller;
use App\Data\Finance\SaveFournisseurVersementData;
use App\Data\Finance\VersementData;
use App\Models\Purchasing\Fournisseur;
use App\Models\Finance\WalletTransaction;
use App\Services\Versements\CreateFournisseurVersementService;
use App\Services\Versements\DeleteFournisseurVersementService;
use App\Services\Versements\UpdateFournisseurVersementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class VersementController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $versements = WalletTransaction::query()
            ->with(['wallet', 'fournisseur', 'creator'])
            ->where('category', WalletTransactionCategory::Versement)
            ->whereNotNull('fournisseur_id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhere('remark', 'like', "%{$search}%")
                        ->orWhereHas('wallet', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('fournisseur', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $versements->through(fn (WalletTransaction $versement) => VersementData::fromTransaction($versement));

        return VersementData::collect($versements, PaginatedDataCollection::class);
    }

    public function stats(): JsonResponse
    {
        $sums = Fournisseur::query()
            ->withSum('completedPurchaseEntries as total_dues_sum', 'total')
            ->withSum('completedPurchaseEntryVersements as entries_paid_amount', 'amount')
            ->withSum('versements as direct_paid_amount', 'amount')
            ->get();

        $totalDues = (int) $sums->sum(fn (Fournisseur $fournisseur) => $fournisseur->totalDues());
        $totalPaid = (int) $sums->sum(fn (Fournisseur $fournisseur) => $fournisseur->totalPaid());

        return response()->json([
            'total_dues' => $totalDues,
            'total_paid' => $totalPaid,
            'total_remaining' => $totalDues - $totalPaid,
        ]);
    }

    public function store(SaveFournisseurVersementData $data): JsonResponse
    {
        try {
            $versement = app(CreateFournisseurVersementService::class)->execute($data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return VersementData::fromTransaction($versement->load(['wallet', 'fournisseur', 'creator']))
            ->toResponse(request())
            ->setStatusCode(201);
    }

    public function update(SaveFournisseurVersementData $data, WalletTransaction $versement): JsonResponse
    {
        $this->authorizeVersement($versement);

        try {
            $versement = app(UpdateFournisseurVersementService::class)->execute($versement, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return VersementData::fromTransaction($versement->load(['wallet', 'fournisseur', 'creator']))
            ->toResponse(request());
    }

    public function destroy(WalletTransaction $versement): JsonResponse
    {
        $this->authorizeVersement($versement);

        app(DeleteFournisseurVersementService::class)->execute($versement);

        return response()->json(['message' => 'Versement supprimé.']);
    }

    protected function authorizeVersement(WalletTransaction $versement): void
    {
        abort_if(
            $versement->category !== WalletTransactionCategory::Versement || $versement->fournisseur_id === null,
            404
        );
    }
}
