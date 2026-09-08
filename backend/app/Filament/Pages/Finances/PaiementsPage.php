<?php

namespace App\Filament\Pages\Finances;

use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class PaiementsPage extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static ?string $navigationLabel = 'Paiements';

    protected static string|UnitEnum|null $navigationGroup = 'Finances';

    protected static ?int $navigationSort = 3;

    protected static ?string $title = 'Paiements';

    protected static ?string $slug = 'finances/paiements';

    protected string $view = 'filament.pages.finances.paiements';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('paiements.view') ?? false;
    }
}
