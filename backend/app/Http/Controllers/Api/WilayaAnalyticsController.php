<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WilayaAnalyticsResource;
use App\Models\Wilaya;
use App\Queries\Wilayas\WilayaAnalyticsQuery;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WilayaAnalyticsController extends Controller
{
    public function __construct(private readonly WilayaAnalyticsQuery $query)
    {
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(auth()->user()->hasPermission('wilayas.view'), 403);

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

        return WilayaAnalyticsResource::collection($wilayas);
    }
}
