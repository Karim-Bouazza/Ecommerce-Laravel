<?php

namespace App\Filament\Pages\Utilisateurs;

use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class RolesPage extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static ?string $navigationLabel = 'Rôles';

    protected static string|UnitEnum|null $navigationGroup = 'Utilisateurs';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Rôles';

    protected static ?string $slug = 'utilisateurs/roles';

    protected string $view = 'filament.pages.utilisateurs.roles';
}
