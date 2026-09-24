<?php

namespace App\Enums;

enum ChargeRecurrenceFrequency: string
{
    case Daily = 'daily';
    case Weekly = 'weekly';
    case Monthly = 'monthly';

    public function label(): string
    {
        return match ($this) {
            self::Daily => 'Quotidienne',
            self::Weekly => 'Hebdomadaire',
            self::Monthly => 'Mensuelle',
        };
    }
}
