<?php

namespace App\Http\Requests;

use App\Enums\DashboardPeriod;
use App\Support\OrderAnalysis\OrderAnalysisFilters;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderAnalysisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('analytics_orders.view');
    }

    /**
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'period' => ['sometimes', 'nullable', Rule::enum(DashboardPeriod::class)],
            'date_basis' => ['sometimes', 'nullable', Rule::in(['created_at', 'status_changed_at'])],
            'date_from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'date_to' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:date_from'],
            'product_id' => ['sometimes', 'nullable', 'integer', 'exists:products,id'],
            'wilaya_id' => ['sometimes', 'nullable', 'integer', 'exists:wilayas,id'],
        ];
    }

    /**
     * Explicit dates take precedence over the preset period.
     */
    public function filters(): OrderAnalysisFilters
    {
        $from = $this->input('date_from');
        $to = $this->input('date_to');

        if (! $from && ! $to) {
            $period = DashboardPeriod::tryFrom((string) $this->input('period')) ?? DashboardPeriod::AllTime;
            [$fromDate, $toDate] = $period->range(CarbonImmutable::now()) ?? [null, null];
        } else {
            $fromDate = $from ? CarbonImmutable::parse($from)->startOfDay() : null;
            $toDate = $to ? CarbonImmutable::parse($to)->endOfDay() : null;
        }

        return new OrderAnalysisFilters(
            from: $fromDate,
            to: $toDate,
            byStatusChangeDate: $this->input('date_basis') === 'status_changed_at',
            productId: $this->integer('product_id') ?: null,
            wilayaId: $this->integer('wilaya_id') ?: null,
        );
    }
}
