<?php

namespace App\Http\Requests\Analytics;

use App\Support\SalesChannelAnalysis\SalesChannelFilters;

class SalesChannelAnalysisRequest extends OrderAnalysisRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('analytics_sales_channels.view');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'min_orders' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_orders' => ['sometimes', 'nullable', 'integer', 'min:0', 'gte:min_orders'],
        ];
    }

    public function channelFilters(): SalesChannelFilters
    {
        return new SalesChannelFilters(
            orders: $this->filters(),
            minOrders: $this->filled('min_orders') ? $this->integer('min_orders') : null,
            maxOrders: $this->filled('max_orders') ? $this->integer('max_orders') : null,
        );
    }
}
