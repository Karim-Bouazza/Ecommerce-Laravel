<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Providers\ZimouCommuneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderCommuneController extends Controller
{
    public function __construct(private readonly ZimouCommuneService $zimouCommuneService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider_wilaya_id' => ['required', 'integer'],
        ]);

        return response()->json([
            'data' => $this->zimouCommuneService->fetchCommunes((int) $validated['provider_wilaya_id']),
        ]);
    }
}
