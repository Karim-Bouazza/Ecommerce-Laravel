<?php

namespace App\Services\Dashboard;

use App\Queries\Dashboard\DashboardOrdersQuery;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Dashboard\DashboardFilters;
use Illuminate\Support\Facades\Storage;

class GetDashboardService
{
    private const TOP_PRODUCTS_LIMIT = 5;

    public function __construct(private readonly DashboardOrdersQuery $query)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function execute(DashboardFilters $filters): array
    {
        $counts = $this->query->counts($filters);

        return [
            'filters' => [
                'date_from' => $filters->from?->toDateString(),
                'date_to' => $filters->to?->toDateString(),
            ],
            'stats' => [
                'total_orders' => $this->metric($counts['total'], $counts['total']),
                'confirmed_orders' => $this->metric($counts['confirmed'], $counts['total']),
                'delivered_orders' => $this->metric($counts['delivered'], $counts['total']),
                'sales' => ['amount' => $this->query->deliveredSales($filters)],
            ],
            'top_products' => $this->query->topProducts($filters, self::TOP_PRODUCTS_LIMIT)
                ->map(fn (object $row) => [
                    'id' => (int) $row->id,
                    'name' => $row->name,
                    'image' => $row->image_1 ? Storage::url($row->image_1) : null,
                    'delivered_orders' => (int) $row->delivered_orders,
                    'quantity' => (int) $row->quantity,
                    'sales' => (float) $row->sales,
                ])
                ->values(),
        ];
    }

    /**
     * @return array{count: int, percentage: float}
     */
    private function metric(int $count, int $total): array
    {
        return [
            'count' => $count,
            'percentage' => OrderRateCalculator::percentage($count, $total),
        ];
    }
}
