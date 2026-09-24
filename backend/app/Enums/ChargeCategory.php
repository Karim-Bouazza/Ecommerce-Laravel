<?php

namespace App\Enums;

enum ChargeCategory: string
{
    case Marketing = 'marketing';
    case HumanResources = 'human_resources';
    case It = 'it';
    case Packaging = 'packaging';
    case Cod = 'cod';
    case Warehouse = 'warehouse';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Marketing => 'Marketing',
            self::HumanResources => 'Ressources humaines',
            self::It => 'IT',
            self::Packaging => 'Emballage',
            self::Cod => 'COD',
            self::Warehouse => 'Entrepôt',
            self::Other => 'Diverses',
        };
    }
}
