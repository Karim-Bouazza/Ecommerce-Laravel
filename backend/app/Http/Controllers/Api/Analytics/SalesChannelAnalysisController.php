<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\SalesChannelFilterData;
use App\Http\Controllers\Controller;
use App\Services\SalesChannelAnalysis\GetSalesChannelChartService;
use App\Services\SalesChannelAnalysis\GetSalesChannelsService;
use Illuminate\Http\JsonResponse;

class SalesChannelAnalysisController extends Controller
{
    public function index(SalesChannelFilterData $data, GetSalesChannelsService $service): JsonResponse
    {
        return response()->json(['data' => $service->execute($data->channelFilters())]);
    }

    public function chart(SalesChannelFilterData $data, GetSalesChannelChartService $service): JsonResponse
    {
        return response()->json($service->execute($data->channelFilters()));
    }
}
