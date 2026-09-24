<?php

namespace App\Enums;

enum ChargeOrderTrigger: string
{
    case NewOrder = 'new_order';
    case ConfirmedOrder = 'confirmed_order';
    case DeliveredOrder = 'delivered_order';

    public function label(): string
    {
        return match ($this) {
            self::NewOrder => 'Chaque nouvelle commande',
            self::ConfirmedOrder => 'Chaque commande confirmée',
            self::DeliveredOrder => 'Chaque commande livrée',
        };
    }
}
