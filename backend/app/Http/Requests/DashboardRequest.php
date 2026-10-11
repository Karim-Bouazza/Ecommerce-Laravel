<?php

namespace App\Http\Requests;

use App\Enums\DashboardPeriod;
use App\Support\Dashboard\DashboardFilters;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('tableau_de_bord.view');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'period' => ['sometimes', Rule::enum(DashboardPeriod::class)],
            'date_from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'date_to' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'after_or_equal:date_from'],
            'wilaya_id' => ['sometimes', 'nullable', 'integer', 'exists:wilayas,id'],
            'product_id' => ['sometimes', 'nullable', 'integer', 'exists:products,id'],
        ];
    }

    /**
     * Explicit dates take precedence over the preset period.
     */
    public function filters(): DashboardFilters
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

        return new DashboardFilters(
            from: $fromDate,
            to: $toDate,
            wilayaId: $this->integer('wilaya_id') ?: null,
            productId: $this->integer('product_id') ?: null,
        );
    }
}
