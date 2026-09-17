<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Providers\ZimouWilayaService;
use Illuminate\Http\JsonResponse;

class ProviderWilayaController extends Controller
{
    public function __construct(private readonly ZimouWilayaService $zimouWilayaService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->zimouWilayaService->listWithLocalMatch()]);
    }
}
