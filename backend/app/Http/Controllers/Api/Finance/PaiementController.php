<?php

namespace App\Http\Controllers\Api\Finance;

use App\Enums\Wallet\WalletTransactionCategory;
use App\Http\Controllers\Controller;
use App\Data\Finance\PaiementData;
use App\Data\Finance\SaveDeliveryPaymentData;
use App\Models\Finance\WalletTransaction;
use App\Services\Paiements\CreateDeliveryPaymentService;
use App\Services\Paiements\DeleteDeliveryPaymentService;
use App\Services\Paiements\UpdateDeliveryPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Spatie\LaravelData\PaginatedDataCollection;

class PaiementController extends Controller
{
    public function index(Request $request): PaginatedDataCollection
    {
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

        $paiements->through(fn (WalletTransaction $paiement) => PaiementData::fromTransaction($paiement));

        return PaiementData::collect($paiements, PaginatedDataCollection::class);
    }

    public function store(SaveDeliveryPaymentData $data): JsonResponse
    {
        try {
            $paiement = app(CreateDeliveryPaymentService::class)->execute($data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return PaiementData::fromTransaction($paiement->load(['wallet', 'deliveryCompanyIntegration', 'creator']))
            ->toResponse(request())
            ->setStatusCode(201);
    }

    public function update(SaveDeliveryPaymentData $data, WalletTransaction $paiement): JsonResponse
    {
        $this->authorizePaiement($paiement);

        try {
            $paiement = app(UpdateDeliveryPaymentService::class)->execute($paiement, $data);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return PaiementData::fromTransaction($paiement->load(['wallet', 'deliveryCompanyIntegration', 'creator']))
            ->toResponse(request());
    }

    public function destroy(WalletTransaction $paiement): JsonResponse
    {
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
