<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Providers\ZimouDeliveryPriceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderDeliveryPriceController extends Controller
{
    public function __construct(private readonly ZimouDeliveryPriceService $zimouDeliveryPriceService)
    {
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
}
