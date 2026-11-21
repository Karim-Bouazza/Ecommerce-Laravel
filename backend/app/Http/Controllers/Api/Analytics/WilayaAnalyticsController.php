<?php

namespace App\Http\Controllers\Api\Analytics;

use App\Data\Analytics\WilayaAnalyticsData;
use App\Http\Controllers\Controller;
use App\Models\Delivery\Wilaya;
use App\Queries\Wilayas\WilayaAnalyticsQuery;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class WilayaAnalyticsController extends Controller
{
    public function __construct(private readonly WilayaAnalyticsQuery $query)
    {
    }

    public function index(Request $request): PaginatedDataCollection
    {
        $perPage = (int) $request->input('per_page', 15);
        $search = trim((string) $request->input('search', ''));
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $productId = $request->input('product_id');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');

        $productId = $productId !== null ? (int) $productId : null;
        $priceMin = $priceMin !== null ? (float) $priceMin : null;
        $priceMax = $priceMax !== null ? (float) $priceMax : null;

        $wilayas = $this->query
            ->build($search !== '' ? $search : null, $dateFrom, $dateTo, $productId, $priceMin, $priceMax)
            ->orderByDesc('total_orders_count')
            ->paginate($perPage)
            ->withQueryString();

        $totals = $this->query->totals($dateFrom, $dateTo, $productId, $priceMin, $priceMax);
        $wilayas->getCollection()->each(function (Wilaya $wilaya) use ($totals) {
            $wilaya->setAttribute('grand_total_orders_count', $totals['total_orders_count']);
            $wilaya->setAttribute('grand_confirmed_count', $totals['confirmed_count']);
            $wilaya->setAttribute('grand_delivered_count', $totals['delivered_count']);
            $wilaya->setAttribute('grand_returned_count', $totals['returned_count']);
        });

        $wilayas->through(fn (Wilaya $wilaya) => WilayaAnalyticsData::fromWilaya($wilaya));

        return WilayaAnalyticsData::collect($wilayas, PaginatedDataCollection::class);
    }
}
