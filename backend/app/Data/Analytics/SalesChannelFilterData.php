<?php

namespace App\Data\Analytics;

use App\Enums\Dashboard\DashboardPeriod;
use App\Support\OrderAnalysis\OrderAnalysisFilters;
use App\Support\SalesChannelAnalysis\SalesChannelFilters;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class SalesChannelFilterData extends Data
{
    use ResolvesPeriod;

    public function __construct(
        public ?string $period = null,
        public ?string $date_basis = null,
        public ?string $date_from = null,
        public ?string $date_to = null,
        public ?int $product_id = null,
        public ?int $wilaya_id = null,
        public ?int $min_orders = null,
        public ?int $max_orders = null,
    ) {}

    public static function rules(): array
    {
        return [
            'period' => ['sometimes', 'nullable', Rule::enum(DashboardPeriod::class)],
            'date_basis' => ['sometimes', 'nullable', Rule::in(['created_at', 'status_changed_at'])],
            'date_from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'date_to' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:date_from'],
            'product_id' => ['sometimes', 'nullable', 'integer', 'exists:products,id'],
            'wilaya_id' => ['sometimes', 'nullable', 'integer', 'exists:wilayas,id'],
            'min_orders' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_orders' => ['sometimes', 'nullable', 'integer', 'min:0', 'gte:min_orders'],
        ];
    }

    public function channelFilters(): SalesChannelFilters
    {
        [$from, $to] = $this->resolveRange();

        return new SalesChannelFilters(
            orders: new OrderAnalysisFilters(
                from: $from,
                to: $to,
                byStatusChangeDate: $this->date_basis === 'status_changed_at',
                productId: $this->product_id ?: null,
                wilayaId: $this->wilaya_id ?: null,
            ),
            minOrders: $this->min_orders,
            maxOrders: $this->max_orders,
        );
    }
}
