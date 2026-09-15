<?php

namespace App\Http\Controllers\Api;

use App\Enums\WalletTransactionCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVersementRequest;
use App\Http\Requests\UpdateVersementRequest;
use App\Http\Resources\VersementResource;
use App\Models\Fournisseur;
use App\Models\WalletTransaction;
use App\Services\Versements\CreateFournisseurVersementService;
use App\Services\Versements\DeleteFournisseurVersementService;
use App\Services\Versements\UpdateFournisseurVersementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class VersementController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('versements.view'), 403);

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

        return VersementResource::collection($versements);
    }

    public function stats(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('versements.view'), 403);

        $fournisseurs = Fournisseur::all();

        $totalDues = (int) $fournisseurs->sum(fn (Fournisseur $fournisseur) => $fournisseur->totalDues());
        $totalPaid = (int) $fournisseurs->sum(fn (Fournisseur $fournisseur) => $fournisseur->totalPaid());

        return response()->json([
            'total_dues' => $totalDues,
            'total_paid' => $totalPaid,
            'total_remaining' => $totalDues - $totalPaid,
        ]);
    }

    public function store(StoreVersementRequest $request): JsonResponse
    {
        try {
            $versement = app(CreateFournisseurVersementService::class)->execute($request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return (new VersementResource($versement->load(['wallet', 'fournisseur', 'creator'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateVersementRequest $request, WalletTransaction $versement): JsonResponse
    {
        $this->authorizeVersement($versement);

        try {
            $versement = app(UpdateFournisseurVersementService::class)->execute($versement, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return (new VersementResource($versement->load(['wallet', 'fournisseur', 'creator'])))
            ->response();
    }

    public function destroy(WalletTransaction $versement): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('versements.delete'), 403);

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
