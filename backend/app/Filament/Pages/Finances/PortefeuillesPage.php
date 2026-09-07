<?php

namespace App\Filament\Pages\Finances;

use App\Enums\WalletTransactionType;
use App\Filament\Pages\Finances\Concerns\InteractsWithWalletRecords;
use App\Filament\Pages\Finances\Widgets\WalletStatsOverview;
use App\Models\Wallet;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class PortefeuillesPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithWalletRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedWallet;

    protected static ?string $navigationLabel = 'Portefeuilles';

    protected static string|UnitEnum|null $navigationGroup = 'Finances';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Portefeuilles';

    protected static ?string $slug = 'finances/portefeuilles';

    protected string $view = 'filament.pages.finances.portefeuilles';

    protected function getHeaderWidgets(): array
    {
        return [
            WalletStatsOverview::class,
        ];
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Wallet::query()
                    ->withSum(['transactions as entries_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::In)], 'amount')
                    ->withSum(['transactions as exits_sum_amount' => fn ($query) => $query->where('type', WalletTransactionType::Out)], 'amount')
            )
            ->searchPlaceholder('Rechercher nom')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->searchable(),
                TextColumn::make('balance')
                    ->label('Solde')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZD')
                    ->sortable(),
                TextColumn::make('entries_sum_amount')
                    ->label('Entrée')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZD')
                    ->color('success')
                    ->sortable(),
                TextColumn::make('exits_sum_amount')
                    ->label('Sortie')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->suffix(' DZD')
                    ->color('danger')
                    ->sortable(),
                TextColumn::make('remark')
                    ->label('Remarque')
                    ->placeholder('—'),
            ])
            ->headerActions([
                self::createWalletAction(),
                self::transferAction(),
            ])
            ->recordActions([
                self::editWalletAction(),
                self::depositAction(),
                self::withdrawAction(),
                self::viewTransactionsAction(),
                self::deleteWalletAction(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
