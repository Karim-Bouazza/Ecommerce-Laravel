<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DashboardRequest;
use App\Services\Dashboard\GetDashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private readonly GetDashboardService $dashboard)
    {
    }

    public function index(DashboardRequest $request): JsonResponse
    {
        return response()->json($this->dashboard->execute($request->filters()));
    }
}
