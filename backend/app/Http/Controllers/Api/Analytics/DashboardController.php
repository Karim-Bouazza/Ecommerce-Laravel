<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\DashboardFilterData;
use App\Http\Controllers\Controller;
use App\Services\Dashboard\GetDashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly GetDashboardService $dashboard)
    {
    }

    public function index(DashboardFilterData $data): JsonResponse
    {
        return response()->json($this->dashboard->execute($data->filters()));
    }
}
