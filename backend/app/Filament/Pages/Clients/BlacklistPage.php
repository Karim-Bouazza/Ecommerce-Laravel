<?php

namespace App\Filament\Pages\Clients;

use App\Filament\Pages\Clients\Concerns\InteractsWithClientRecords;
use App\Models\Client;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class BlacklistPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithClientRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNoSymbol;

    protected static ?string $navigationLabel = 'Liste Noire';

    protected static string|UnitEnum|null $navigationGroup = 'Clients';

    protected static ?int $navigationSort = 2;

    protected static ?string $title = 'Liste Noire';

    protected static ?string $slug = 'clients/liste-noire';

    protected string $view = 'filament.pages.blacklist';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('clients_blacklist.view') ?? false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Client::query()
                    ->where('is_blacklisted', true)
                    ->with(['wilaya', 'commune'])
                    ->withCount('orders')
            )
            ->searchPlaceholder('Rechercher par Nom, Téléphone, Wilaya, Commune')
            ->columns([
                TextColumn::make('name')
                    ->label('Nom')
                    ->state(fn (Client $record) => trim("{$record->first_name} {$record->last_name}"))
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(['first_name', 'last_name']),
                TextColumn::make('phone_number')
                    ->label('Téléphone')
                    ->icon(Heroicon::OutlinedPhone)
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Numéro copié !')
                    ->url(fn (Client $record) => "tel:{$record->phone_number}"),
                TextColumn::make('adresse')
                    ->label('Adresse')
                    ->state(fn (Client $record) => collect([$record->wilaya?->name, $record->commune?->name])
                        ->filter()
                        ->implode(', '))
                    ->searchable(['wilaya.name', 'commune.name'])
                    ->placeholder('—'),
                TextColumn::make('blacklist_reason')
                    ->label('Motif')
                    ->placeholder('—')
                    ->wrap(),
                TextColumn::make('blacklisted_at')
                    ->label('Bloqué le')
                    ->date('d/m/Y')
                    ->placeholder('—')
                    ->sortable(),
                TextColumn::make('orders_count')
                    ->label('Commandes')
                    ->badge()
                    ->color('gray')
                    ->alignCenter(),
            ])
            ->recordActions([
                self::toggleBlacklistAction()->visible(fn () => auth()->user()->hasPermission('clients.edit')),
                self::viewOrdersAction(),
                DeleteAction::make()
                    ->modalHeading('Supprimer le Client')
                    ->modalSubmitActionLabel('Supprimer')
                    ->modalCancelActionLabel('Fermer')
                    ->iconButton()
                    ->tooltip('Supprimer')
                    ->visible(fn () => auth()->user()->hasPermission('clients.delete')),
            ])
            ->defaultSort('blacklisted_at', 'desc')
            ->emptyStateHeading('Aucun client sur liste noire')
            ->emptyStateDescription('Les clients bloqués depuis la page Clients apparaîtront ici.')
            ->emptyStateIcon(Heroicon::OutlinedNoSymbol);
    }
}
