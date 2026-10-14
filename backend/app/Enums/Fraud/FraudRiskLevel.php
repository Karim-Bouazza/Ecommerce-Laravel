<?php

namespace App\Enums\Fraud;

enum FraudRiskLevel: string
{
    case Low = 'LOW';
    case Medium = 'MEDIUM';
    case High = 'HIGH';
    case Critical = 'CRITICAL';

    public static function fromScore(int $score): self
    {
        $levels = config('fraud.levels');

        return match (true) {
            $score >= $levels['critical'] => self::Critical,
            $score >= $levels['high'] => self::High,
            $score >= $levels['medium'] => self::Medium,
            default => self::Low,
        };
    }

    /** Informational only; nothing is enforced automatically. */
    public function recommendedAction(): string
    {
        return match ($this) {
            self::Low => 'none',
            self::Medium => 'review',
            self::High, self::Critical => 'priority_review',
        };
    }
}
