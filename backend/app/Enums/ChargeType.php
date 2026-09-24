<?php

namespace App\Enums;

enum ChargeType: string
{
    case Normal = 'normal';
    case PerOrder = 'per_order';
    case Recurring = 'recurring';

    public function label(): string
    {
        return match ($this) {
            self::Normal => 'Normal',
            self::PerOrder => 'Par commande',
            self::Recurring => 'Récurrent',
        };
    }
}
