<?php

namespace App\Support\SalesChannelAnalysis;

use App\Support\OrderAnalysis\OrderAnalysisFilters;

final readonly class SalesChannelFilters
{
    public function __construct(
        public OrderAnalysisFilters $orders,
        public ?int $minOrders = null,
        public ?int $maxOrders = null,
    ) {}

    /**
     * Whether a channel with this many orders is kept by the min/max filter.
     */
    public function accepts(int $ordersCount): bool
    {
        return ($this->minOrders === null || $ordersCount >= $this->minOrders)
            && ($this->maxOrders === null || $ordersCount <= $this->maxOrders);
    }
}
