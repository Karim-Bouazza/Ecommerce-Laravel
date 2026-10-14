<?php

namespace App\Data\Fraud;

use Spatie\LaravelData\Data;

/** Earlier orders of the same phone that ended in a configured suspicious status. */
class OutcomeSignal extends Data
{
    /** @param list<string> $statuses */
    public function __construct(
        public bool $enabled,
        public int $orders,
        public array $statuses,
    ) {}
}
