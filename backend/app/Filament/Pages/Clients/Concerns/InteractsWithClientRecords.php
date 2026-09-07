<?php

namespace App\Filament\Pages\Clients\Concerns;

use App\Models\Client;
use App\Models\Communes;
use App\Models\Wilaya;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\View\View as ViewContract;

trait InteractsWithClientRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function clientFormSchema(): array
    {
        return [
            TextInput::make('first_name')
                ->label('Prénom')
                ->required(),
            TextInput::make('last_name')
                ->label('Nom')
                ->required(),
            TextInput::make('phone_number')
                ->label('Téléphone')
                ->tel()
                ->required(),
            Select::make('wilaya_id')
                ->label('Wilaya')
                ->options(Wilaya::pluck('name', 'id'))
                ->searchable()
                ->preload()
                ->live()
                ->required()
                ->afterStateUpdated(fn (Set $set) => $set('commune_id', null)),
            Select::make('commune_id')
                ->label('Commune')
                ->options(fn (Get $get) => Communes::where('wilaya_id', $get('wilaya_id'))->pluck('name', 'id'))
                ->searchable()
                ->preload()
                ->required()
                ->disabled(fn (Get $get) => blank($get('wilaya_id'))),
        ];
    }

    protected static function toggleBlacklistAction(): Action
    {
        return Action::make('toggleBlacklist')
            ->label(fn (Client $record) => $record->is_blacklisted ? 'Débloquer' : 'Bloquer')
            ->tooltip(fn (Client $record) => $record->is_blacklisted ? 'Débloquer' : 'Bloquer')
            ->icon(fn (Client $record) => $record->is_blacklisted ? Heroicon::OutlinedUserPlus : Heroicon::OutlinedUserMinus)
            ->color(fn (Client $record) => $record->is_blacklisted ? 'success' : 'danger')
            ->iconButton()
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Confirmer')
            ->modalCancelActionLabel('Fermer')
            ->schema(fn (Client $record) => $record->is_blacklisted ? [] : [
                Textarea::make('blacklist_reason')
                    ->label('Motif')
                    ->rows(2),
            ])
            ->action(function (Client $record, array $data): void {
                $record->update($record->is_blacklisted ? [
                    'is_blacklisted' => false,
                    'blacklist_reason' => null,
                    'blacklisted_at' => null,
                ] : [
                    'is_blacklisted' => true,
                    'blacklist_reason' => $data['blacklist_reason'] ?? null,
                    'blacklisted_at' => now(),
                ]);

                Notification::make()
                    ->title($record->is_blacklisted ? 'Client ajouté à la liste noire' : 'Client retiré de la liste noire')
                    ->success()
                    ->send();
            });
    }

    protected static function viewOrdersAction(): Action
    {
        return Action::make('viewOrders')
            ->label('Commandes')
            ->tooltip('Commandes')
            ->icon(Heroicon::OutlinedClipboardDocumentList)
            ->color('info')
            ->iconButton()
            ->modalHeading(fn (Client $record) => "Commandes de {$record->first_name} {$record->last_name}")
            ->modalContent(fn (Client $record): ViewContract => view(
                'filament.pages.clients.orders-modal',
                ['orders' => $record->orders()->latest()->get()],
            ))
            ->modalSubmitAction(false)
            ->modalCancelActionLabel('Fermer');
    }
}
