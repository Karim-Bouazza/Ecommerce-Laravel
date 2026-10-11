<?php

namespace App\Support\Dashboard;

use Carbon\CarbonImmutable;

final readonly class DashboardFilters
{
    public function __construct(
        public ?CarbonImmutable $from = null,
        public ?CarbonImmutable $to = null,
        public ?int $wilayaId = null,
        public ?int $productId = null,
    ) {
    }
}
