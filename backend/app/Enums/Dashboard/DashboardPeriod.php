<?php

namespace App\Enums\Dashboard;

use Carbon\CarbonImmutable;

enum DashboardPeriod: string
{
    case AllTime = 'all_time';
    case Today = 'today';
    case Yesterday = 'yesterday';
    case LastWeek = 'last_week';
    case ThisMonth = 'this_month';
    case LastMonth = 'last_month';

    /**
     * Inclusive [from, to] bounds of the period, or null when unbounded.
     *
     * @return array{0: CarbonImmutable, 1: CarbonImmutable}|null
     */
    public function range(CarbonImmutable $now): ?array
    {
        return match ($this) {
            self::AllTime => null,
            self::Today => [$now->startOfDay(), $now->endOfDay()],
            self::Yesterday => [$now->subDay()->startOfDay(), $now->subDay()->endOfDay()],
            self::LastWeek => [$now->subWeek()->startOfWeek(), $now->subWeek()->endOfWeek()],
            self::ThisMonth => [$now->startOfMonth(), $now->endOfMonth()],
            self::LastMonth => [$now->subMonthNoOverflow()->startOfMonth(), $now->subMonthNoOverflow()->endOfMonth()],
        };
    }
}
