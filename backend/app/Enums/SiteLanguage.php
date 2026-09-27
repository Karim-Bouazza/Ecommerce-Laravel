<?php

namespace App\Enums;

enum SiteLanguage: string
{
    case Fr = 'fr';
    case Ar = 'ar';

    public function label(): string
    {
        return match ($this) {
            self::Fr => 'Français',
            self::Ar => 'العربية',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(fn (self $language) => $language->value, self::cases());
    }
}
