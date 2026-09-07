<?php

namespace App\Filament\Pages\Inventaire;

use App\Filament\Pages\Inventaire\Concerns\InteractsWithPurchaseEntryRecords;
use App\Models\PurchaseEntry;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class EntreesAchatPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithPurchaseEntryRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowDownOnSquare;

    protected static ?string $navigationLabel = 'Entrées d’achat';

    protected static string|UnitEnum|null $navigationGroup = 'Inventaire';

    protected static ?int $navigationSort = 6;

    protected static ?string $title = 'Entrées d’achat';

    protected static ?string $slug = 'inventaire/entrees-achat';

    protected string $view = 'filament.pages.inventaire.entrees-achat';

    public function table(Table $table): Table
    {
        return $table
            ->query(PurchaseEntry::query()->with(['warehouse', 'fournisseur']))
            ->searchPlaceholder('Rechercher Code, Nom, Description')
            ->columns([
                TextColumn::make('reference')
                    ->label('Ref')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->label('Date de création')
                    ->dateTime('Y-m-d H:i:s'),
                TextColumn::make('warehouse.name')
                    ->label('Entrepôt'),
                TextColumn::make('fournisseur.name')
                    ->label('Fournisseur'),
                TextColumn::make('total')
                    ->label('Total')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' '),
                TextColumn::make('payment_status')
                    ->label('Statut de paiement')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state->label())
                    ->color(fn ($state) => $state->color()),
                TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state->label())
                    ->color(fn ($state) => $state->color()),
            ])
            ->headerActions([
                self::createPurchaseEntryAction(),
            ])
            ->recordActions([
                self::viewPurchaseEntryAction(),
                self::purchaseEntryItemsAction(),
                self::confirmPurchaseEntryAction(),
                self::editPurchaseEntryAction(),
                self::deletePurchaseEntryAction(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
