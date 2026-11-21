<?php

namespace App\Http\Controllers\Api\Delivery;

use App\Data\Delivery\CalculatePackagePriceData;
use App\Data\Delivery\PackagePriceData;
use App\Http\Controllers\Controller;
use App\Services\Providers\ZimouDeliveryPriceService;
use App\Services\Providers\ZimouPackagePriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderDeliveryPriceController extends Controller
{
    public function __construct(
        private readonly ZimouDeliveryPriceService $zimouDeliveryPriceService,
        private readonly ZimouPackagePriceService $zimouPackagePriceService,
    ) {
    }

    public function home(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider_wilaya_id' => ['required', 'integer'],
            'provider_commune_id' => ['nullable', 'integer'],
        ]);

        return response()->json([
            'price' => $this->zimouDeliveryPriceService->fetchHomeDeliveryPrice(
                (int) $validated['provider_wilaya_id'],
                isset($validated['provider_commune_id']) ? (int) $validated['provider_commune_id'] : null
            ),
        ]);
    }

    public function calculatePackage(CalculatePackagePriceData $data): PackagePriceData
    {
        $result = $this->zimouPackagePriceService->calculatePrice(
            $data->price,
            $data->provider_wilaya_id,
            $data->provider_commune_id,
            $data->delivery_type,
            $data->free_delivery,
            $data->can_be_opened,
            $data->provider_office_id,
        );

        return PackagePriceData::fromResult($result);
    }
}
