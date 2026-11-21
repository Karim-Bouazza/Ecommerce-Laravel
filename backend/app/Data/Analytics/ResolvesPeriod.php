<?php

namespace App\Data\Analytics;

use App\Enums\Dashboard\DashboardPeriod;
use Carbon\CarbonImmutable;

trait ResolvesPeriod
{
    /** @return array{0: ?CarbonImmutable, 1: ?CarbonImmutable} */
    protected function resolveRange(): array
    {
        if (! $this->date_from && ! $this->date_to) {
            $period = DashboardPeriod::tryFrom((string) $this->period) ?? DashboardPeriod::AllTime;

            return $period->range(CarbonImmutable::now()) ?? [null, null];
        }

        return [
            $this->date_from ? CarbonImmutable::parse($this->date_from)->startOfDay() : null,
            $this->date_to ? CarbonImmutable::parse($this->date_to)->endOfDay() : null,
        ];
    }
}
