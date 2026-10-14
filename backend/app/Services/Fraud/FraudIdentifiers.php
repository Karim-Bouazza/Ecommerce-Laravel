<?php

namespace App\Services\Fraud;

use App\Enums\Order\OrderAttemptStatus;
use App\Models\Order\OrderAttempt;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;

/** Shared helpers: identifier ↔ column mapping and the business-day window. */
class FraudIdentifiers
{
    /** identifier type → order_attempts column */
    public const COLUMNS = [
        'fingerprint' => 'fingerprint_key',
        'phone' => 'phone_key',
        'ip' => 'ip_key',
        'address' => 'address_key',
    ];

    /** @return array<string, string> type → key, only for non-null keys */
    public static function keysOf(OrderAttempt $attempt): array
    {
        $keys = [];

        foreach (self::COLUMNS as $type => $column) {
            if ($attempt->{$column} !== null) {
                $keys[$type] = $attempt->{$column};
            }
        }

        return $keys;
    }

    /**
     * Calendar-day bounds (in the business timezone) containing $moment,
     * returned as UTC instants for querying.
     *
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    public static function dayBounds(CarbonInterface $moment): array
    {
        $local = $moment->copy()->setTimezone(config('fraud.timezone'));

        return [
            $local->copy()->startOfDay()->utc(),
            $local->copy()->endOfDay()->utc(),
        ];
    }

    /** Attempts that really produced an order. */
    public static function createdOrderAttempts(): Builder
    {
        return OrderAttempt::query()
            ->where('status', OrderAttemptStatus::OrderCreated->value)
            ->whereNotNull('order_id');
    }

    /** Restrict to attempts sharing at least one of the given keys. */
    public static function sharingAnyKey(Builder $query, array $keys): Builder
    {
        return $query->where(function (Builder $q) use ($keys) {
            foreach ($keys as $type => $key) {
                $q->orWhere(self::COLUMNS[$type], $key);
            }
        });
    }
}
