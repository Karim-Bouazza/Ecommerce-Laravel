<?php

namespace App\Filament\Pages\Finances;

use App\Enums\WalletTransactionCategory;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Filament\Actions\Action;
use Filament\Pages\Page;
use Filament\Resources\Concerns\HasTabs;
use Filament\Schemas\Components\EmbeddedTable;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class WalletTransactionsPage extends Page implements HasTable
{
    use HasTabs;
    use InteractsWithTable;

    protected static ?string $slug = 'finances/portefeuilles/{wallet}/transactions';

    protected static string|UnitEnum|null $navigationGroup = 'Finances';

    protected static bool $shouldRegisterNavigation = false;

    protected static ?string $title = 'Transactions';

    public Wallet $wallet;

    public function mount(Wallet $wallet): void
    {
        $this->wallet = $wallet;
        $this->loadDefaultActiveTab();
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            $this->getTabsContentComponent(),
            EmbeddedTable::make(),
        ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back')
                ->label('Retour')
                ->icon(Heroicon::ArrowLeft)
                ->color('gray')
                ->url(fn () => route('filament.admin.pages.finances.portefeuilles')),
        ];
    }

    /**
     * @return array<string, Tab>
     */
    public function getTabs(): array
    {
        return [
            'all' => Tab::make('Tous'),
            'withdrawal' => Tab::make('Retrait')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('category', WalletTransactionCategory::Withdrawal)),
            'deposit' => Tab::make('Dépôt')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('category', WalletTransactionCategory::Deposit)),
            'versement' => Tab::make('Versement')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('category', WalletTransactionCategory::Versement)),
            'payment' => Tab::make('Paiement')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('category', WalletTransactionCategory::Payment)),
        ];
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(fn () => $this->modifyQueryWithActiveTab(
                WalletTransaction::query()->where('wallet_id', $this->wallet->id)
            ))
            ->searchPlaceholder('Rechercher nom')
            ->columns([
                TextColumn::make('reference')
                    ->label('Ref')
                    ->searchable()
                    ->color('primary'),
                TextColumn::make('date')
                    ->label('Date')
                    ->date('Y-m-d')
                    ->sortable(),
                TextColumn::make('creator.name')
                    ->label('Créateur')
                    ->placeholder('—'),
                TextColumn::make('amount')
                    ->label('Montant (DZD)')
                    ->numeric(decimalPlaces: 0, thousandsSeparator: ' ')
                    ->sortable(),
                TextColumn::make('remark')
                    ->label('Remarque')
                    ->placeholder('—'),
                TextColumn::make('category')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn (WalletTransactionCategory $state) => $state->label())
                    ->color(fn (WalletTransactionCategory $state) => $state->color()),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
