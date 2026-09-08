<?php

namespace App\Filament\Pages\Utilisateurs;

use App\Filament\Pages\Utilisateurs\Concerns\InteractsWithAdministrateurRecords;
use App\Models\User;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class AdministrateursPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithAdministrateurRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static ?string $navigationLabel = 'Administrateurs';

    protected static string|UnitEnum|null $navigationGroup = 'Utilisateurs';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Administrateurs';

    protected static ?string $slug = 'utilisateurs/administrateurs';

    protected string $view = 'filament.pages.utilisateurs.administrateurs';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('administrateurs.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(User::query())
            ->searchPlaceholder('Rechercher nom ou email')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Téléphone')
                    ->placeholder('—'),
                TextColumn::make('role.name')
                    ->label('Rôle')
                    ->badge()
                    ->placeholder('—'),
                TextColumn::make('is_active')
                    ->label('Actif')
                    ->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'OUI' : 'NON')
                    ->color(fn (bool $state) => $state ? 'success' : 'danger'),
            ])
            ->headerActions([
                self::createAdministrateurAction()->visible(fn () => auth()->user()->hasPermission('administrateurs.create')),
            ])
            ->recordActions([
                self::editAdministrateurAction()->visible(fn () => auth()->user()->hasPermission('administrateurs.edit')),
                self::deleteAdministrateurAction()->visible(fn () => auth()->user()->hasPermission('administrateurs.delete')),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
