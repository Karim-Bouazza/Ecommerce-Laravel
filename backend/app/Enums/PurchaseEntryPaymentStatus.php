<?php

namespace App\Enums;

enum PurchaseEntryPaymentStatus: string
{
    case Unpaid = 'unpaid';
    case Partial = 'partial';
    case Paid = 'paid';

    public function label(): string
    {
        return match ($this) {
            self::Unpaid => 'Non payé',
            self::Partial => 'Partiellement payé',
            self::Paid => 'Payé',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Unpaid => 'warning',
            self::Partial => 'info',
            self::Paid => 'success',
        };
    }
}
