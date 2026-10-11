<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PerformanceRequest;
use App\Services\Performance\GetPerformanceRevenueService;
use App\Services\Performance\GetPerformanceSalesEvolutionService;
use Illuminate\Http\JsonResponse;

class PerformanceController extends Controller
{
    public function revenue(PerformanceRequest $request, GetPerformanceRevenueService $service): JsonResponse
    {
        return response()->json($service->execute($request->filters()));
    }

    public function salesEvolution(PerformanceRequest $request, GetPerformanceSalesEvolutionService $service): JsonResponse
    {
        return response()->json($service->execute($request->filters()));
    }
}
