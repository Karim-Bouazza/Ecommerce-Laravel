<?php

namespace App\Services\Fraud;

use App\Data\Fraud\ExcludedIpMatch;
use App\Models\Order\OrderAttempt;
use App\Services\PixelTracking\ExcludedIpMatcher;

class ExcludedIpCalculator
{
    public function __construct(private readonly ExcludedIpMatcher $matcher) {}

    public function match(OrderAttempt $attempt): ?ExcludedIpMatch
    {
        $match = $this->matcher->mostSpecificMatch($attempt->ip_address);

        if ($match === null) {
            return null;
        }

        $points = 1;

        foreach (config('fraud.excluded_ip.tiers') as [$minSpecificity, $tierPoints]) {
            if ($match['specificity'] >= $minSpecificity) {
                $points = $tierPoints;
                break;
            }
        }

        return new ExcludedIpMatch(
            $match['pattern'],
            round($match['specificity'], 2),
            min($points, (int) config('fraud.excluded_ip.cap')),
        );
    }
}
