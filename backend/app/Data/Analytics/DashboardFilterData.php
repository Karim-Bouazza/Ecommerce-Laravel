<?php

namespace App\Data\Analytics;

use App\Enums\Dashboard\DashboardPeriod;
use App\Support\Dashboard\DashboardFilters;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class DashboardFilterData extends Data
{
    use ResolvesPeriod;

    public function __construct(
        public ?string $period = null,
        public ?string $date_from = null,
        public ?string $date_to = null,
        public ?int $wilaya_id = null,
        public ?int $product_id = null,
    ) {}

    public static function rules(): array
    {
        return [
            'period' => ['sometimes', Rule::enum(DashboardPeriod::class)],
            'date_from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'date_to' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:date_from'],
            'wilaya_id' => ['sometimes', 'nullable', 'integer', 'exists:wilayas,id'],
            'product_id' => ['sometimes', 'nullable', 'integer', 'exists:products,id'],
        ];
    }

    public function filters(): DashboardFilters
    {
        [$from, $to] = $this->resolveRange();

        return new DashboardFilters(
            from: $from,
            to: $to,
            wilayaId: $this->wilaya_id ?: null,
            productId: $this->product_id ?: null,
        );
    }
}
