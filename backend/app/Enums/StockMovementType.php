<?php

namespace App\Enums;

use Filament\Support\Icons\Heroicon;

enum StockMovementType: string
{
    case In = 'in';
    case Out = 'out';

    public function label(): string
    {
        return match ($this) {
            self::In => 'Entrée',
            self::Out => 'Sortie',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::In => 'success',
            self::Out => 'danger',
        };
    }

    public function icon(): Heroicon
    {
        return match ($this) {
            self::In => Heroicon::OutlinedArrowDownOnSquare,
            self::Out => Heroicon::OutlinedArrowUpOnSquare,
        };
    }

    public function sign(): int
    {
        return match ($this) {
            self::In => 1,
            self::Out => -1,
        };
    }
}
