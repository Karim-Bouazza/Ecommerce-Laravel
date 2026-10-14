<?php

namespace App\Data\Fraud;

use Spatie\LaravelData\Data;

/** Most specific excluded-IP entry matching the order IP, with its points. */
class ExcludedIpMatch extends Data
{
    public function __construct(
        public string $pattern,
        public float $specificity,
        public int $points,
    ) {}
}
