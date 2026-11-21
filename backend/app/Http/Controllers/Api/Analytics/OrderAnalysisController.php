<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\OrderAnalysisFilterData;
use App\Http\Controllers\Controller;
use App\Services\OrderAnalysis\GetOrderAnalysisService;
use App\Services\OrderAnalysis\GetOrderStatusBreakdownService;
use Illuminate\Http\JsonResponse;

class OrderAnalysisController extends Controller
{
    public function overview(OrderAnalysisFilterData $data, GetOrderAnalysisService $service): JsonResponse
    {
        return response()->json($service->execute($data->filters()));
    }

    public function statuses(OrderAnalysisFilterData $data, GetOrderStatusBreakdownService $service): JsonResponse
    {
        return response()->json($service->execute($data->filters()));
    }
}
