<?php

namespace App\Data\Fraud;

use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/** Earlier orders sharing an identifier that a reviewer confirmed as fake. */
#[MapOutputName(SnakeCaseMapper::class)]
class HistoricalMatch extends Data
{
    /** @param list<int> $orderIds */
    public function __construct(
        public int $orders,
        public array $orderIds,
    ) {}
}
