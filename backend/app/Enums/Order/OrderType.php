<?php

namespace App\Enums\Order;

enum OrderType: string
{
    case Manuelle = 'manuelle';
    case Ads = 'ads';

    public function label(): string
    {
        return match ($this) {
            self::Manuelle => 'Manuelle',
            self::Ads => 'Ads',
        };
    }

    /**
     * Kind of sales channel the orders come from.
     */
    public function channel(): string
    {
        return match ($this) {
            self::Manuelle => 'Interne',
            self::Ads => 'Boutique en ligne',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Manuelle => 'gray',
            self::Ads => 'success',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $type) => [$type->value => $type->label()])
            ->all();
    }
}
