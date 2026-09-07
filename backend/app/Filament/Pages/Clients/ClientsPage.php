<?php

namespace App\Filament\Pages\Clients;

use App\Filament\Pages\Clients\Concerns\InteractsWithClientRecords;
use App\Models\Client;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use UnitEnum;

class ClientsPage extends Page implements HasTable
{
    use InteractsWithTable;
    use InteractsWithClientRecords;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static ?string $navigationLabel = 'Clients';

    protected static string|UnitEnum|null $navigationGroup = 'Clients';

    protected static ?int $navigationSort = 1;

    protected static ?string $title = 'Clients';

    protected static ?string $slug = 'clients';

    protected string $view = 'filament.pages.clients';

    public function table(Table $table): Table
    {
        return $table
            ->query(Client::query()->with(['wilaya', 'commune'])->withCount('orders'))
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
                TextColumn::make('orders_count')
                    ->label('Commandes')
                    ->badge()
                    ->color('gray')
                    ->alignCenter(),
                TextColumn::make('is_blacklisted')
                    ->label('Statut')
                    ->badge()
                    ->formatStateUsing(fn (bool $state) => $state ? 'Liste noire' : 'Actif')
                    ->color(fn (bool $state) => $state ? 'danger' : 'success'),
            ])
            ->recordActions([
                EditAction::make()
                    ->schema(fn () => self::clientFormSchema())
                    ->modalHeading('Modifier le Client')
                    ->modalSubmitActionLabel('Enregistrer')
                    ->modalCancelActionLabel('Fermer')
                    ->modalWidth('md')
                    ->iconButton()
                    ->tooltip('Modifier'),
                self::toggleBlacklistAction(),
                DeleteAction::make()
                    ->modalHeading('Supprimer le Client')
                    ->modalSubmitActionLabel('Supprimer')
                    ->modalCancelActionLabel('Fermer')
                    ->iconButton()
                    ->tooltip('Supprimer'),
                self::viewOrdersAction(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
