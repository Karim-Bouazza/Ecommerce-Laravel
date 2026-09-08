<?php

namespace App\Filament\Pages\Inventaire;

use App\Filament\Pages\Inventaire\Concerns\InteractsWithWarehouseRecords;
use App\Models\Warehouse;
use App\Services\Warehouses\UpdateWarehouseService;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class EntrepotsPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithWarehouseRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static ?string $navigationLabel = 'Entrepôts';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Entrepôts';

    protected static ?string $slug = 'inventaire/entrepots';

    protected string $view = 'filament.pages.inventaire.entrepots';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('entrepots.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Warehouse::query())
            ->searchPlaceholder('Rechercher nom')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Téléphone')
                    ->placeholder('—'),
                TextColumn::make('address')
                    ->label('Adresse')
                    ->limit(40)
                    ->placeholder('—'),
                TextColumn::make('all_wilayas')
                    ->label('Toutes les wilayas')
                    ->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'OUI' : 'NON')
                    ->color(fn (bool $state) => $state ? 'success' : 'danger'),
                TextColumn::make('all_products')
                    ->label('Tous les produits')
                    ->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'OUI' : 'NON')
                    ->color(fn (bool $state) => $state ? 'success' : 'danger'),
                TextColumn::make('remark')
                    ->label('Remarque')
                    ->placeholder('—'),
                ToggleColumn::make('active')
                    ->label('Actif')
                    ->visible(fn () => auth()->user()->hasPermission('entrepots.edit'))
                    ->afterStateUpdated(fn (Warehouse $record, bool $state) => app(UpdateWarehouseService::class)->execute($record, ['active' => $state])),
            ])
            ->headerActions([
                self::createWarehouseAction()->visible(fn () => auth()->user()->hasPermission('entrepots.create')),
            ])
            ->recordActions([
                self::editWarehouseAction()->visible(fn () => auth()->user()->hasPermission('entrepots.edit')),
                self::deleteWarehouseAction()->visible(fn () => auth()->user()->hasPermission('entrepots.delete')),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
