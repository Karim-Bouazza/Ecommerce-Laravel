<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Providers\ZimouStopDeskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderStopDeskController extends Controller
{
    public function __construct(private readonly ZimouStopDeskService $zimouStopDeskService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider_wilaya_id' => ['required', 'integer'],
            'provider_commune_id' => ['required', 'integer'],
        ]);

        return response()->json([
            'data' => $this->zimouStopDeskService->fetchStopDesks(
                (int) $validated['provider_wilaya_id'],
                (int) $validated['provider_commune_id']
            ),
        ]);
    }
}
