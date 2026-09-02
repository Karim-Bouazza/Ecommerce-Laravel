<?php

namespace App\Enums;

enum DeliveryType: string
{
    case Domicile = 'domicile';
    case StopDesk = 'stop_desk';

    public function label(): string
    {
        return match ($this) {
            self::Domicile => 'Domicile',
            self::StopDesk => 'Stop desk',
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
