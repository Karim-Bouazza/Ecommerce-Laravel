<?php

namespace App\Enums\Fraud;

enum FraudReviewLabel: string
{
    case Unknown = 'UNKNOWN';
    case Legitimate = 'LEGITIMATE';
    case ConfirmedFake = 'CONFIRMED_FAKE';

    public function requiresReason(): bool
    {
        return $this !== self::Unknown;
    }
}
