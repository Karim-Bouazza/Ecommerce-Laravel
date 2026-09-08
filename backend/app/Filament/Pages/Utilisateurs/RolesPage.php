<?php

namespace App\Filament\Pages\Utilisateurs;

use App\Filament\Pages\Utilisateurs\Concerns\InteractsWithRoleRecords;
use App\Models\Role;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class RolesPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithRoleRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldCheck;

    protected static ?string $navigationLabel = 'Rôles';

    protected static string|UnitEnum|null $navigationGroup = 'Utilisateurs';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Rôles';

    protected static ?string $slug = 'utilisateurs/roles';

    protected string $view = 'filament.pages.utilisateurs.roles';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('roles.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Role::query()->withCount('users'))
            ->searchPlaceholder('Rechercher nom')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('is_system')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'Système' : 'Personnalisé')
                    ->color(fn (bool $state) => $state ? 'warning' : 'gray'),
                TextColumn::make('users_count')
                    ->label('Administrateurs')
                    ->badge()
                    ->color('gray')
                    ->alignCenter(),
            ])
            ->headerActions([
                self::createRoleAction()->visible(fn () => auth()->user()->hasPermission('roles.create')),
            ])
            ->recordActions([
                self::editRoleAction()->visible(fn () => auth()->user()->hasPermission('roles.edit')),
                self::deleteRoleAction()->visible(fn () => auth()->user()->hasPermission('roles.delete')),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
