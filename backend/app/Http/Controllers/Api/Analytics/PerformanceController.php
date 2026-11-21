<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\PerformanceFilterData;
use App\Http\Controllers\Controller;
use App\Services\Performance\GetPerformanceRevenueService;
use App\Services\Performance\GetPerformanceSalesEvolutionService;
use Illuminate\Http\JsonResponse;

class PerformanceController extends Controller
{
    public function revenue(PerformanceFilterData $data, GetPerformanceRevenueService $service): JsonResponse
    {
        return response()->json($service->execute($data->filters()));
    }

    public function salesEvolution(PerformanceFilterData $data, GetPerformanceSalesEvolutionService $service): JsonResponse
    {
        return response()->json($service->execute($data->filters()));
    }
}
