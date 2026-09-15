<?php

namespace App\Http\Controllers\Api;

use App\Enums\WalletTransactionCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Http\Resources\PaiementResource;
use App\Models\WalletTransaction;
use App\Services\Paiements\CreateDeliveryPaymentService;
use App\Services\Paiements\DeleteDeliveryPaymentService;
use App\Services\Paiements\UpdateDeliveryPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use RuntimeException;

class PaiementController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('paiements.view'), 403);

        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));

        $paiements = WalletTransaction::query()
            ->with(['wallet', 'deliveryCompanyIntegration', 'creator'])
            ->where('category', WalletTransactionCategory::Payment)
            ->whereNotNull('delivery_company_integration_id')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhere('remark', 'like', "%{$search}%")
                        ->orWhereHas('wallet', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('deliveryCompanyIntegration', fn ($query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return PaiementResource::collection($paiements);
    }

    public function store(StorePaiementRequest $request): JsonResponse
    {
        try {
            $paiement = app(CreateDeliveryPaymentService::class)->execute($request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return (new PaiementResource($paiement->load(['wallet', 'deliveryCompanyIntegration', 'creator'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePaiementRequest $request, WalletTransaction $paiement): JsonResponse
    {
        $this->authorizePaiement($paiement);

        try {
            $paiement = app(UpdateDeliveryPaymentService::class)->execute($paiement, $request->validated());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return (new PaiementResource($paiement->load(['wallet', 'deliveryCompanyIntegration', 'creator'])))
            ->response();
    }

    public function destroy(WalletTransaction $paiement): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('paiements.delete'), 403);

        $this->authorizePaiement($paiement);

        app(DeleteDeliveryPaymentService::class)->execute($paiement);

        return response()->json(['message' => 'Paiement supprimé.']);
    }

    protected function authorizePaiement(WalletTransaction $paiement): void
    {
        abort_if(
            $paiement->category !== WalletTransactionCategory::Payment || $paiement->delivery_company_integration_id === null,
            404
        );
    }
}
