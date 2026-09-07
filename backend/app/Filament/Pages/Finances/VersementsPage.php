<?php

namespace App\Filament\Pages\Finances;

use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class VersementsPage extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowDownTray;

    protected static ?string $navigationLabel = 'Versements';

    protected static string|UnitEnum|null $navigationGroup = 'Finances';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Versements';

    protected static ?string $slug = 'finances/versements';

    protected string $view = 'filament.pages.finances.versements';
}
