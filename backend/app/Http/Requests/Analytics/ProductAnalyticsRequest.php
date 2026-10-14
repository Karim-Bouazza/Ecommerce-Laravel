<?php

namespace App\Http\Requests\Analytics;

use Carbon\CarbonImmutable;

class ProductAnalyticsRequest extends OrderAnalysisRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('products.view');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'price_min' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:price_min'],
        ];
    }

    /**
     * Start of the selected period (preset or explicit dates), if bounded.
     */
    public function periodStart(): ?CarbonImmutable
    {
        return $this->filters()->from;
    }

    /**
     * End of the selected period (preset or explicit dates), if bounded.
     */
    public function periodEnd(): ?CarbonImmutable
    {
        return $this->filters()->to;
    }
}
