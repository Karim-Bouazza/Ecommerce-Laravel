<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Data\Delivery\DeliveryCompanyIntegrationData;
use App\Data\Delivery\SaveDeliveryCompanyIntegrationData;
use App\Http\Controllers\Controller;
use App\Models\Delivery\DeliveryCompanyIntegration;
use App\Services\Partners\DeleteDeliveryCompanyIntegrationService;
use App\Services\Partners\SaveDeliveryCompanyIntegrationService;
use App\Support\DeliveryCompanyIntegrationRegistry;
use Illuminate\Http\JsonResponse;

class DeliveryCompanyIntegrationController extends Controller
{
    public function index(): JsonResponse
    {
        $data = DeliveryCompanyIntegration::query()
            ->whereNotNull('api_token')
            ->get()
            ->map(function (DeliveryCompanyIntegration $integration) {
                $company = DeliveryCompanyIntegrationRegistry::get($integration->company_key);

                return [
                    'id' => $integration->id,
                    'company_key' => $integration->company_key,
                    'entreprise' => $company['name'] ?? $integration->name,
                    'name' => $integration->name,
                ];
            })
            ->values();

        return response()->json(['data' => $data]);
    }

    public function show(string $companyKey): JsonResponse
    {
        $company = DeliveryCompanyIntegrationRegistry::get($companyKey);

        abort_unless($company !== null, 404);

        $integration = DeliveryCompanyIntegration::where('company_key', $companyKey)->first();

        if ($integration === null) {
            return response()->json([
                'data' => DeliveryCompanyIntegrationData::unconfigured($companyKey, $company),
            ]);
        }

        return response()->json([
            'data' => DeliveryCompanyIntegrationData::fromIntegration($integration),
        ]);
    }

    public function update(SaveDeliveryCompanyIntegrationData $data, string $companyKey): JsonResponse
    {
        abort_unless(DeliveryCompanyIntegrationRegistry::exists($companyKey), 404);

        $integration = app(SaveDeliveryCompanyIntegrationService::class)
            ->execute($companyKey, $data);

        return response()->json([
            'data' => DeliveryCompanyIntegrationData::fromIntegration($integration),
        ]);
    }

    public function destroy(string $companyKey): JsonResponse
    {
        abort_unless(DeliveryCompanyIntegrationRegistry::exists($companyKey), 404);

        app(DeleteDeliveryCompanyIntegrationService::class)->execute($companyKey);

        return response()->json(['message' => 'Intégration supprimée.']);
    }
}
