<?php

namespace App\Services\Fraud;

use Illuminate\Support\Str;

class IdentifierNormalizer
{
    /** Algerian numbers: +213555123456 / 00213555123456 / 0555123456 → 0555123456 */
    public function phone(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?? '';

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '00213')) {
            $digits = '0'.substr($digits, 5);
        } elseif (str_starts_with($digits, '213') && strlen($digits) >= 11) {
            $digits = '0'.substr($digits, 3);
        } elseif (strlen($digits) === 9 && $digits[0] !== '0') {
            $digits = '0'.$digits;
        }

        return $digits;
    }

    /**
     * Combines the free-text address with the delivery wilaya/commune ids.
     * Returns null when there is nothing specific enough to match on.
     */
    public function address(?string $address, int|string|null $wilayaId, int|string|null $communeId): ?string
    {
        $text = Str::of(Str::ascii((string) $address))
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', ' ')
            ->squish()
            ->toString();

        if ($text === '' && empty($communeId)) {
            return null;
        }

        return implode('|', [(string) $wilayaId, (string) $communeId, $text]);
    }

    public function ip(?string $ip): ?string
    {
        if ($ip === null || $ip === '') {
            return null;
        }

        $packed = @inet_pton($ip);

        return $packed === false ? null : inet_ntop($packed);
    }

    public function fingerprint(?string $fingerprint): ?string
    {
        $value = trim((string) $fingerprint);

        return $value === '' ? null : $value;
    }
}
