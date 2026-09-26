<?php

namespace App\Http\Controllers\Api;

use App\Enums\DeliveryType;
use App\Http\Controllers\Controller;
use App\Http\Requests\CalculatePackagePriceRequest;
use App\Http\Resources\PackagePriceResource;
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

    public function calculatePackage(CalculatePackagePriceRequest $request): PackagePriceResource
    {
        $validated = $request->validated();

        $result = $this->zimouPackagePriceService->calculatePrice(
            (int) $validated['price'],
            (int) $validated['provider_wilaya_id'],
            isset($validated['provider_commune_id']) ? (int) $validated['provider_commune_id'] : null,
            DeliveryType::from($validated['delivery_type']),
            (bool) ($validated['free_delivery'] ?? false),
            (bool) ($validated['can_be_opened'] ?? false),
            $validated['provider_office_id'] ?? null,
        );

        return new PackagePriceResource($result);
    }
}
