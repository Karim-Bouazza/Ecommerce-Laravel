<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Charge;
use App\Models\OrderItem;
use App\Services\Charges\CalculateChargeAmountService;
use Illuminate\Http\JsonResponse;

class PerformanceController extends Controller
{
    public function revenue(): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('performance_kpi.view'), 403);

        $totals = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->where('orders.status', OrderStatus::Delivered)
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0) as ventes')
            ->selectRaw('COALESCE(SUM(order_items.quantity * products.purchase_price), 0) as capital')
            ->first();

        $ventes = (float) $totals->ventes;
        $capital = (float) $totals->capital;
        $revenus = $ventes - $capital;

        $calculator = app(CalculateChargeAmountService::class);
        $charges = Charge::query()
            ->with('products:id')
            ->get()
            ->sum(fn (Charge $charge) => $calculator->execute($charge));

        $benefices = $revenus - $charges;

        return response()->json([
            'ventes' => $ventes,
            'revenus' => $revenus,
            'benefices' => $benefices,
            'benefices_pourcentage' => $ventes > 0 ? round($benefices / $ventes * 100, 2) : 0.0,
            'roi' => $capital > 0 ? round($benefices / $capital * 100, 2) : 0.0,
            'capital' => $capital,
        ]);
    }
}
