<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductAnalyticsChartResource;
use App\Http\Resources\ProductAnalyticsResource;
use App\Models\Product;
use App\Queries\Products\ProductAnalyticsQuery;
use App\Support\Analytics\ProductAnalyticsCalculator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductAnalyticsController extends Controller
{
    public function __construct(private readonly ProductAnalyticsQuery $query)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('products.view'), 403);

        $perPage = (int) $request->input('per_page', 15);

        $products = $this->filteredQuery($request)
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return ProductAnalyticsResource::collection($products);
    }

    public function stats(Request $request): JsonResponse
    {
        abort_unless(auth()->user()->hasPermission('products.view'), 403);

        $keys = [
            'total_orders_count', 'total_quantity',
            'confirmed_no_stock_count', 'confirmed_no_stock_quantity',
            'confirmed_count', 'confirmed_quantity',
            'delivered_count', 'delivered_quantity', 'delivered_sales_value',
            'returned_count', 'returned_quantity',
            'confirmed_or_later_count', 'pending_count', 'delivery_resolved_count',
            'cost',
        ];

        $totals = $this->filteredQuery($request)->get()->reduce(
            fn (array $totals, Product $product) => [
                'total_orders_count' => $totals['total_orders_count'] + $product->total_orders_count,
                'total_quantity' => $totals['total_quantity'] + $product->total_quantity,
                'confirmed_no_stock_count' => $totals['confirmed_no_stock_count'] + $product->confirmed_no_stock_count,
                'confirmed_no_stock_quantity' => $totals['confirmed_no_stock_quantity'] + $product->confirmed_no_stock_quantity,
                'confirmed_count' => $totals['confirmed_count'] + $product->confirmed_count,
                'confirmed_quantity' => $totals['confirmed_quantity'] + $product->confirmed_quantity,
                'delivered_count' => $totals['delivered_count'] + $product->delivered_count,
                'delivered_quantity' => $totals['delivered_quantity'] + $product->delivered_quantity,
                'delivered_sales_value' => $totals['delivered_sales_value'] + $product->delivered_sales_value,
                'returned_count' => $totals['returned_count'] + $product->returned_count,
                'returned_quantity' => $totals['returned_quantity'] + $product->returned_quantity,
                'confirmed_or_later_count' => $totals['confirmed_or_later_count'] + $product->confirmed_or_later_count,
                'pending_count' => $totals['pending_count'] + $product->pending_count,
                'delivery_resolved_count' => $totals['delivery_resolved_count'] + $product->delivery_resolved_count,
                'cost' => $totals['cost'] + (ProductAnalyticsCalculator::cost((int) $product->delivered_quantity, $product->purchase_price) ?? 0),
            ],
            array_fill_keys($keys, 0),
        );

        $sales = (float) $totals['delivered_sales_value'];
        $cost = (float) $totals['cost'];
        $margin = $sales - $cost;

        return response()->json([
            'nombre_commandes' => ['count' => $totals['total_orders_count'], 'quantity' => $totals['total_quantity']],
            'confirme_sans_stock' => ['count' => $totals['confirmed_no_stock_count'], 'quantity' => $totals['confirmed_no_stock_quantity']],
            'commandes_confirmees' => ['count' => $totals['confirmed_count'], 'quantity' => $totals['confirmed_quantity']],
            'commandes_livrees' => ['count' => $totals['delivered_count'], 'quantity' => $totals['delivered_quantity']],
            'commandes_retournees' => ['count' => $totals['returned_count'], 'quantity' => $totals['returned_quantity']],
            'taux_confirmation' => ProductAnalyticsCalculator::confirmationRate($totals['confirmed_or_later_count'], $totals['total_orders_count']),
            'performance_confirmation' => ProductAnalyticsCalculator::confirmationPerformance($totals['confirmed_or_later_count'], $totals['total_orders_count'], $totals['pending_count']),
            'taux_livraison' => ProductAnalyticsCalculator::deliveryRate($totals['delivered_count'], $totals['total_orders_count']),
            'performance_livraison' => ProductAnalyticsCalculator::deliveryPerformance($totals['delivered_count'], $totals['delivery_resolved_count']),
            'quantite_vendue' => $totals['delivered_quantity'],
            'ventes' => $sales,
            'cout_total_produit' => $cost,
            'marge_brute' => $margin,
            'profit_pourcentage' => ProductAnalyticsCalculator::profitPercentage($margin, $sales),
        ]);
    }

    public function chart(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('products.view'), 403);

        $limit = min((int) $request->input('limit', 10), 20);

        $products = $this->filteredQuery($request)
            ->orderByDesc('delivered_count')
            ->limit($limit)
            ->get();

        return ProductAnalyticsChartResource::collection($products);
    }

    private function filteredQuery(Request $request): Builder
    {
        $search = trim((string) $request->input('search', ''));
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        return $this->query->build($search !== '' ? $search : null, $dateFrom, $dateTo);
    }
}
