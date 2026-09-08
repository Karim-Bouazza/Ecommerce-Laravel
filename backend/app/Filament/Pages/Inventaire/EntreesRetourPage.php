<?php

namespace App\Filament\Pages\Inventaire;

use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class EntreesRetourPage extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowUturnLeft;

    protected static ?string $navigationLabel = 'Entrées de retour';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 7;

    protected static ?string $title = 'Entrées de retour';

    protected static ?string $slug = 'inventaire/entrees-retour';

    protected string $view = 'filament.pages.inventaire.entrees-retour';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('entrees_retour.view') ?? false;
    }
}
