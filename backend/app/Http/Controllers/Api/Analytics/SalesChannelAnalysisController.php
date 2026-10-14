<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\SalesChannelAnalysisRequest;
use App\Services\SalesChannelAnalysis\GetSalesChannelChartService;
use App\Services\SalesChannelAnalysis\GetSalesChannelsService;
use Illuminate\Http\JsonResponse;

class SalesChannelAnalysisController extends Controller
{
    public function index(SalesChannelAnalysisRequest $request, GetSalesChannelsService $service): JsonResponse
    {
        return response()->json(['data' => $service->execute($request->channelFilters())]);
    }

    public function chart(SalesChannelAnalysisRequest $request, GetSalesChannelChartService $service): JsonResponse
    {
        return response()->json($service->execute($request->channelFilters()));
    }
}
