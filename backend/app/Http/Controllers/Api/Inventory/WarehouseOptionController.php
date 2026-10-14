<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Inventory\Warehouse;
use Illuminate\Http\JsonResponse;

class WarehouseOptionController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(
            auth()->user()->hasPermission('stock.view')
                || auth()->user()->hasPermission('suivi_stock.view')
                || auth()->user()->hasPermission('orders.create')
                || auth()->user()->hasPermission('orders.edit'),
            403
        );

        $warehouses = Warehouse::query()
            ->where('active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $warehouses]);
    }
}
