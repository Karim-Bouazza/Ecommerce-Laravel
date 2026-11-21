<?php

namespace App\Data\Analytics;

use App\Enums\Dashboard\DashboardPeriod;
use App\Support\OrderAnalysis\OrderAnalysisFilters;
use Carbon\CarbonImmutable;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class ProductAnalyticsFilterData extends Data
{
    use ResolvesPeriod;

    public function __construct(
        public ?string $period = null,
        public ?string $date_basis = null,
        public ?string $date_from = null,
        public ?string $date_to = null,
        public ?int $product_id = null,
        public ?int $wilaya_id = null,
        public ?int $page = null,
        public ?int $per_page = null,
        public ?int $limit = null,
        public ?string $search = null,
        public ?float $price_min = null,
        public ?float $price_max = null,
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'price_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:price_min'],
        ];
    }

    public function filters(): OrderAnalysisFilters
    {
        [$from, $to] = $this->resolveRange();

        return new OrderAnalysisFilters(
            from: $from,
            to: $to,
            byStatusChangeDate: $this->date_basis === 'status_changed_at',
            productId: $this->product_id ?: null,
            wilayaId: $this->wilaya_id ?: null,
        );
    }

    public function periodStart(): ?CarbonImmutable
    {
        return $this->filters()->from;
    }

    public function periodEnd(): ?CarbonImmutable
    {
        return $this->filters()->to;
    }
}
