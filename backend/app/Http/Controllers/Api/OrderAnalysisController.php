<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderAnalysisRequest;
use App\Services\OrderAnalysis\GetOrderAnalysisService;
use App\Services\OrderAnalysis\GetOrderStatusBreakdownService;
use Illuminate\Http\JsonResponse;

class OrderAnalysisController extends Controller
{
    public function overview(OrderAnalysisRequest $request, GetOrderAnalysisService $service): JsonResponse
    {
        return response()->json($service->execute($request->filters()));
    }

    public function statuses(OrderAnalysisRequest $request, GetOrderStatusBreakdownService $service): JsonResponse
    {
        return response()->json($service->execute($request->filters()));
    }
}
