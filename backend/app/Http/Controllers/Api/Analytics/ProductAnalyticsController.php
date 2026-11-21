<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\ProductAnalyticsChartData;
use App\Data\Analytics\ProductAnalyticsData;
use App\Data\Analytics\ProductAnalyticsFilterData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use App\Queries\Products\ProductAnalyticsQuery;
use App\Services\Charges\AllocateChargesToProductsService;
use App\Services\Meta\GetProductAdSpendService;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Analytics\ProductAnalyticsCalculator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Spatie\LaravelData\DataCollection;
use Spatie\LaravelData\PaginatedDataCollection;

class ProductAnalyticsController extends Controller
{
    public function __construct(
        private readonly ProductAnalyticsQuery $query,
        private readonly AllocateChargesToProductsService $chargeAllocator,
        private readonly GetProductAdSpendService $adSpend,
    ) {}

    public function index(ProductAnalyticsFilterData $request): PaginatedDataCollection
    {
        $perPage = $request->per_page ?? 15;

        $products = $this->filteredQuery($request)
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        $allocations = $this->chargeAllocator->execute($request->periodStart(), $request->periodEnd());
        $adSpends = $this->adSpend->execute($request->periodStart(), $request->periodEnd());
        $products->getCollection()->each(function (Product $product) use ($allocations, $adSpends) {
            $product->setAttribute('charge_totale', $allocations[$product->id] ?? 0.0);
            $product->setAttribute('ad_spend', $adSpends[$product->id] ?? 0.0);
        });

        $products->through(fn (Product $product) => ProductAnalyticsData::fromProduct($product));

        return ProductAnalyticsData::collect($products, PaginatedDataCollection::class);
    }

    public function stats(ProductAnalyticsFilterData $request): JsonResponse
    {
        $keys = [
            'total_orders_count', 'total_quantity',
            'confirmed_no_stock_count', 'confirmed_no_stock_quantity',
            'confirmed_count', 'confirmed_quantity',
            'delivered_count', 'delivered_quantity', 'delivered_sales_value',
            'returned_count', 'returned_quantity',
            'pending_count', 'delivery_resolved_count',
            'cost', 'charge', 'ad_spend',
        ];

        $allocations = $this->chargeAllocator->execute($request->periodStart(), $request->periodEnd());
        $adSpends = $this->adSpend->execute($request->periodStart(), $request->periodEnd());

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
                'pending_count' => $totals['pending_count'] + $product->pending_count,
                'delivery_resolved_count' => $totals['delivery_resolved_count'] + $product->delivery_resolved_count,
                'cost' => $totals['cost'] + (ProductAnalyticsCalculator::cost((int) $product->delivered_quantity, $product->purchase_price) ?? 0),
                'charge' => $totals['charge'] + ($allocations[$product->id] ?? 0.0),
                'ad_spend' => $totals['ad_spend'] + ($adSpends[$product->id] ?? 0.0),
            ],
            array_fill_keys($keys, 0),
        );

        $sales = (float) $totals['delivered_sales_value'];
        $cost = (float) $totals['cost'];
        $margin = $sales - $cost;
        $charge = (float) $totals['charge'];
        $adSpend = (float) $totals['ad_spend'];
        $beneficeNet = $margin - $charge - $adSpend;

        return response()->json([
            'nombre_commandes' => ['count' => $totals['total_orders_count'], 'quantity' => $totals['total_quantity']],
            'confirme_sans_stock' => ['count' => $totals['confirmed_no_stock_count'], 'quantity' => $totals['confirmed_no_stock_quantity']],
            'commandes_confirmees' => ['count' => $totals['confirmed_count'], 'quantity' => $totals['confirmed_quantity']],
            'commandes_livrees' => ['count' => $totals['delivered_count'], 'quantity' => $totals['delivered_quantity']],
            'commandes_retournees' => ['count' => $totals['returned_count'], 'quantity' => $totals['returned_quantity']],
            'taux_confirmation' => OrderRateCalculator::confirmationRate($totals['confirmed_count'], $totals['total_orders_count']),
            'performance_confirmation' => OrderRateCalculator::confirmationPerformance($totals['confirmed_count'], $totals['total_orders_count'], $totals['pending_count']),
            'taux_livraison' => OrderRateCalculator::deliveryRate($totals['delivered_count'], $totals['total_orders_count']),
            'performance_livraison' => OrderRateCalculator::deliveryPerformance($totals['delivered_count'], $totals['delivery_resolved_count']),
            'quantite_vendue' => $totals['delivered_quantity'],
            'ventes' => $sales,
            'cout_total_produit' => $cost,
            'marge_brute' => $margin,
            'profit_pourcentage' => ProductAnalyticsCalculator::profitPercentage($margin, $sales),
            'charge_totale' => $charge,
            'ad_spend' => $adSpend,
            'benefice_net' => $beneficeNet,
            'profit_net_pourcentage' => ProductAnalyticsCalculator::profitPercentage($beneficeNet, $sales),
        ]);
    }

    public function chart(ProductAnalyticsFilterData $request): DataCollection
    {
        $limit = $request->limit ?? 10;

        $products = $this->filteredQuery($request)
            ->orderByDesc('delivered_count')
            ->limit($limit)
            ->get();

        return ProductAnalyticsChartData::collect($products, DataCollection::class);
    }

    private function filteredQuery(ProductAnalyticsFilterData $request): Builder
    {
        $search = trim((string) ($request->search ?? ''));
        $dateFrom = $request->periodStart()?->toDateString();
        $dateTo = $request->periodEnd()?->toDateString();
        $wilayaId = $request->wilaya_id;
        $priceMin = $request->price_min;
        $priceMax = $request->price_max;

        return $this->query->build(
            $search !== '' ? $search : null,
            $dateFrom,
            $dateTo,
            $wilayaId !== null ? (int) $wilayaId : null,
            $priceMin !== null ? (float) $priceMin : null,
            $priceMax !== null ? (float) $priceMax : null,
        );
    }
}
