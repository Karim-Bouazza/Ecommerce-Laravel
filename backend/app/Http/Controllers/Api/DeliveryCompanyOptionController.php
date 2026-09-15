<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryCompany;
use Illuminate\Http\JsonResponse;

class DeliveryCompanyOptionController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(
            auth()->user()->hasPermission('orders.create') || auth()->user()->hasPermission('orders.edit'),
            403
        );

        $companies = DeliveryCompany::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $companies]);
    }
}
