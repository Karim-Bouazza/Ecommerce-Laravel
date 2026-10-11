<?php

namespace App\Support\Performance;

use Carbon\CarbonImmutable;

final readonly class PerformanceFilters
{
    public function __construct(
        public ?CarbonImmutable $from = null,
        public ?CarbonImmutable $to = null,
        public bool $byStatusChangeDate = false,
        public ?int $productId = null,
        public ?int $warehouseId = null,
    ) {}
}
