<?php

namespace App\Enums;

/**
 * Homepage sections whose products are picked by the admin.
 */
enum StorefrontProductSection: string
{
    case BestOffers = 'best_offers';
    case NewArrivals = 'new_arrivals';
    case StylePicks = 'style_picks';

    public function maxItems(): int
    {
        return match ($this) {
            self::BestOffers => 5,
            self::NewArrivals => 4,
            self::StylePicks => 7,
        };
    }
}
