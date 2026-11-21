<?php

namespace App\Data\Fraud;

use Spatie\LaravelData\Data;

class ExcludedIpMatch extends Data
{
    public function __construct(
        public string $pattern,
        public float $specificity,
        public int $points,
    ) {}
}
