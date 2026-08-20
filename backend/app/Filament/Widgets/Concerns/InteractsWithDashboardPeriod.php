<?php

namespace App\Filament\Widgets\Concerns;

use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Support\Carbon;

trait InteractsWithDashboardPeriod
{
    use InteractsWithPageFilters;

    protected function getPeriod(): string
    {
        return $this->pageFilters['period'] ?? 'all';
    }

    /**
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    protected function getPeriodRange(): array
    {
        return match ($this->getPeriod()) {
            'today' => [Carbon::today(), Carbon::today()],
            'week' => [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()],
            'month' => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
            'year' => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            'custom' => [
                filled($this->pageFilters['from'] ?? null) ? Carbon::parse($this->pageFilters['from']) : null,
                filled($this->pageFilters['until'] ?? null) ? Carbon::parse($this->pageFilters['until']) : null,
            ],
            default => [null, null],
        };
    }
}
