<?php

namespace App\Support;

class DeliveryCompanyIntegrationRegistry
{
    /**
     * @return array<string, array{name: string, base_url: string}>
     */
    public static function companies(): array
    {
        return [
            'zimou' => [
                'name' => 'Zimou Express',
                'base_url' => 'https://zimou.express/api',
            ],
        ];
    }

    public static function exists(string $companyKey): bool
    {
        return array_key_exists($companyKey, static::companies());
    }

    /**
     * @return array{name: string, base_url: string}|null
     */
    public static function get(string $companyKey): ?array
    {
        return static::companies()[$companyKey] ?? null;
    }
}
