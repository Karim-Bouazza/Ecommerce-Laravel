<?php

namespace App\Support;

class PermissionRegistry
{
    /**
     * @return array<string, array<string, string>>
     */
    public static function grouped(): array
    {
        return collect(config('permissions.groups'))
            ->mapWithKeys(fn (array $group) => [$group['label'] => $group['permissions']])
            ->all();
    }

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return array_keys(static::labels());
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return collect(config('permissions.groups'))
            ->flatMap(fn (array $group) => $group['permissions'])
            ->all();
    }

    public static function isSystemRole(string $name): bool
    {
        return in_array($name, config('permissions.system_roles'), true);
    }

    public static function label(string $key): string
    {
        return static::labels()[$key] ?? $key;
    }
}
