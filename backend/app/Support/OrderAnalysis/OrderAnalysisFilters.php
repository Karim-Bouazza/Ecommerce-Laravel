<?php

namespace App\Support\OrderAnalysis;

use Carbon\CarbonImmutable;

final readonly class OrderAnalysisFilters
{
    public function __construct(
        public ?CarbonImmutable $from = null,
        public ?CarbonImmutable $to = null,
        public bool $byStatusChangeDate = false,
        public ?int $productId = null,
        public ?int $wilayaId = null,
    ) {}
}
