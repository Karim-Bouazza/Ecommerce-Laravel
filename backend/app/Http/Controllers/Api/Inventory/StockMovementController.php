<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Data\Inventory\StockMovementData;
use App\Models\Inventory\Warehouse;
use App\Models\Inventory\WarehouseStockMovement;
use Illuminate\Http\JsonResponse;
use App\Support\Query\Filters\DateFilter;
use App\Support\Query\Filters\SearchFilter;
use App\Support\Query\ListQuery;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;

class StockMovementController extends Controller
{
    protected const WITH = ['product', 'warehouse', 'creator'];

    public function index(Request $request): PaginatedDataCollection
    {
        $movements = QueryBuilder::for(
            WarehouseStockMovement::query()->with(self::WITH),
            ListQuery::request($request, ['search', 'warehouse_id', 'product_id', 'type', 'date_from', 'date_to']),
        )
            ->allowedFilters(
                AllowedFilter::exact('warehouse_id'),
                AllowedFilter::exact('product_id'),
                AllowedFilter::exact('type'),
                AllowedFilter::custom('date_from', DateFilter::from('created_at')),
                AllowedFilter::custom('date_to', DateFilter::to('created_at')),
                AllowedFilter::custom('search', new SearchFilter([], ['product' => ['name'], 'creator' => ['name']])),
            )
            ->allowedSorts('created_at', 'type', 'resulting_quantity')
            ->defaultSort('-created_at')
            ->paginate(ListQuery::perPage($request))
            ->withQueryString();

        $movements->through(fn (WarehouseStockMovement $movement) => StockMovementData::fromMovement($movement));

        return StockMovementData::collect($movements, PaginatedDataCollection::class);
    }
}
