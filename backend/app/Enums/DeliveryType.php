<?php

namespace App\Enums;

enum DeliveryType: string
{
    case Express = 'express';
    case PointRelais = 'point_relais';

    public function label(): string
    {
        return match ($this) {
            self::Express => 'Express',
            self::PointRelais => 'Point relais',
        };
    }

    public function zimouId(): int
    {
        return match ($this) {
            self::Express => 2,
            self::PointRelais => 3,
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
