<?php

namespace App\Services\PixelTracking;

use App\Models\Marketing\PixelExcludedIp;
use IPLib\Factory;
use IPLib\Range\RangeInterface;
use Illuminate\Support\Facades\Cache;

class ExcludedIpMatcher
{
    private const CACHE_KEY = 'pixel_excluded_ips.patterns';

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public function matches(?string $ip): bool
    {
        $address = $ip === null ? null : Factory::parseAddressString($ip);

        if ($address === null) {
            return false;
        }

        foreach ($this->patterns() as $pattern) {
            if (self::parse($pattern)?->contains($address)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array{pattern: string, specificity: float}|null
     */
    public function mostSpecificMatch(?string $ip): ?array
    {
        $address = $ip === null ? null : Factory::parseAddressString($ip);

        if ($address === null) {
            return null;
        }

        $bits = str_contains($ip, ':') ? 128 : 32;
        $best = null;

        foreach ($this->patterns() as $pattern) {
            $range = self::parse($pattern);

            if ($range === null || ! $range->contains($address)) {
                continue;
            }

            $specificity = $range->asSubnet()->getNetworkPrefix() / $bits;

            if ($best === null || $specificity > $best['specificity']) {
                $best = ['pattern' => $pattern, 'specificity' => $specificity];
            }
        }

        return $best;
    }

    public static function normalize(string $pattern): ?string
    {
        $pattern = strtolower(trim($pattern));
        $range = self::parse($pattern);

        if ($range === null || self::coversEverything($range)) {
            return null;
        }

        return $pattern;
    }

    public static function canonical(string $pattern): ?string
    {
        $range = self::parse($pattern);

        return $range === null ? null : $range->getComparableStartString().'-'.$range->getComparableEndString();
    }

    public static function type(string $pattern): string
    {
        return match (true) {
            str_contains($pattern, '/') => 'cidr',
            str_contains($pattern, '*') => 'wildcard',
            default => 'exact',
        };
    }

    private static function parse(string $pattern): ?RangeInterface
    {
        if (str_contains($pattern, '-') || str_contains($pattern, ' ')) {
            return null;
        }

        return Factory::parseRangeString($pattern);
    }

    private static function coversEverything(RangeInterface $range): bool
    {
        $edges = [
            ['0.0.0.0', '255.255.255.255'],
            ['::', 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'],
        ];

        foreach ($edges as [$first, $last]) {
            if ($range->contains(Factory::parseAddressString($first)) && $range->contains(Factory::parseAddressString($last))) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<string>
     */
    private function patterns(): array
    {
        return Cache::rememberForever(
            self::CACHE_KEY,
            fn () => PixelExcludedIp::query()->pluck('pattern')->all()
        );
    }
}
