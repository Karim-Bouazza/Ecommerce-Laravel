<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WarehouseProductOptionController extends Controller
{
    public function index(Request $request, Warehouse $warehouse): JsonResponse
    {
        abort_unless(
            auth()->user()->hasPermission('transferts.create')
                || auth()->user()->hasPermission('orders.create')
                || auth()->user()->hasPermission('orders.edit'),
            403
        );

        $search = trim((string) $request->input('search', ''));

        $products = DB::table('products')
            ->joinSub(Stock::inDepotSubquery(), 'stock_ledger', function (JoinClause $join) use ($warehouse) {
                $join->on('stock_ledger.product_id', '=', 'products.id')
                    ->where('stock_ledger.warehouse_id', '=', $warehouse->id);
            })
            ->where('stock_ledger.available_quantity', '>', 0)
            ->when($search !== '', fn ($query) => $query->where('products.name', 'like', "%{$search}%"))
            ->orderBy('products.name')
            ->limit(50)
            ->get(['products.id', 'products.name', 'products.price', 'stock_ledger.available_quantity as quantity']);

        return response()->json(['data' => $products]);
    }
}
