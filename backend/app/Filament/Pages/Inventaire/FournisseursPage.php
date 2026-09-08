<?php

namespace App\Filament\Pages\Inventaire;

use App\Filament\Pages\Inventaire\Concerns\InteractsWithFournisseurRecords;
use App\Models\Fournisseur;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class FournisseursPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithFournisseurRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingStorefront;

    protected static ?string $navigationLabel = 'Fournisseurs';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 5;

    protected static ?string $title = 'Fournisseurs';

    protected static ?string $slug = 'inventaire/fournisseurs';

    protected string $view = 'filament.pages.inventaire.fournisseurs';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('fournisseurs.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(Fournisseur::query())
            ->searchPlaceholder('Rechercher nom')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Téléphone')
                    ->placeholder('—'),
                TextColumn::make('total_dues')
                    ->label('Total des dues')
                    ->state(fn (Fournisseur $record) => $record->totalDues())
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' '),
                TextColumn::make('total_paid')
                    ->label('Montant payé')
                    ->state(fn (Fournisseur $record) => $record->totalPaid())
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' '),
                TextColumn::make('remaining_amount')
                    ->label('Montant restant')
                    ->state(fn (Fournisseur $record) => $record->remainingAmount())
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' '),
                TextColumn::make('remark')
                    ->label('Remarque')
                    ->placeholder('—'),
            ])
            ->headerActions([
                self::createFournisseurAction()->visible(fn () => auth()->user()->hasPermission('fournisseurs.create')),
            ])
            ->recordActions([
                self::editFournisseurAction()->visible(fn () => auth()->user()->hasPermission('fournisseurs.edit')),
                self::deleteFournisseurAction()->visible(fn () => auth()->user()->hasPermission('fournisseurs.delete')),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
