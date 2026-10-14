<?php

namespace App\Services\Fraud;

use RuntimeException;

/**
 * Derives stable keyed (HMAC-SHA256) matching keys. The same identifier always
 * yields the same key as long as FRAUD_HMAC_KEY is unchanged.
 */
class MatchingKeyHasher
{
    public function make(string $type, ?string $normalizedValue): ?string
    {
        if ($normalizedValue === null || $normalizedValue === '') {
            return null;
        }

        return hash_hmac('sha256', $type.':'.$normalizedValue, $this->secret());
    }

    private function secret(): string
    {
        $secret = config('fraud.hmac_key');

        if (is_string($secret) && $secret !== '') {
            return $secret;
        }

        if (app()->isProduction()) {
            throw new RuntimeException('FRAUD_HMAC_KEY must be configured in production.');
        }

        // Non-production fallback so local/test environments work out of the box.
        return hash('sha256', 'fraud-matching|'.config('app.key'));
    }
}
