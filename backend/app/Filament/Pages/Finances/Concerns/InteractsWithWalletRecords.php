<?php

namespace App\Filament\Pages\Finances\Concerns;

use App\Models\Wallet;
use App\Services\Wallets\CreateWalletService;
use App\Services\Wallets\DeleteWalletService;
use App\Services\Wallets\DepositToWalletService;
use App\Services\Wallets\TransferBetweenWalletsService;
use App\Services\Wallets\UpdateWalletService;
use App\Services\Wallets\WithdrawFromWalletService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Support\Icons\Heroicon;
use RuntimeException;

trait InteractsWithWalletRecords
{
    /**
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    protected static function walletFormSchema(): array
    {
        return [
            TextInput::make('name')
                ->label('Nom')
                ->required()
                ->maxLength(255),
            TextInput::make('remark')
                ->label('Remarque')
                ->maxLength(255),
        ];
    }

    protected static function createWalletAction(): Action
    {
        return Action::make('createWallet')
            ->label('Nouveau portefeuille')
            ->icon(Heroicon::Plus)
            ->iconButton()
            ->tooltip('Nouveau portefeuille')
            ->schema(self::walletFormSchema())
            ->modalHeading('Nouveau portefeuille')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (array $data): void {
                app(CreateWalletService::class)->execute($data);

                Notification::make()
                    ->title('Portefeuille créé')
                    ->success()
                    ->send();
            });
    }

    protected static function editWalletAction(): EditAction
    {
        return EditAction::make()
            ->schema(fn () => self::walletFormSchema())
            ->modalHeading('Modifier le portefeuille')
            ->modalSubmitActionLabel('Enregistrer')
            ->modalCancelActionLabel('Fermer')
            ->using(fn (Wallet $record, array $data) => app(UpdateWalletService::class)->execute($record, $data))
            ->iconButton()
            ->tooltip('Modifier');
    }

    protected static function deleteWalletAction(): Action
    {
        return Action::make('deleteWallet')
            ->label('Supprimer')
            ->tooltip('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->iconButton()
            ->requiresConfirmation()
            ->modalSubmitActionLabel('Supprimer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Wallet $record): void {
                try {
                    app(DeleteWalletService::class)->execute($record);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Portefeuille supprimé')
                    ->success()
                    ->send();
            });
    }

    protected static function depositAction(): Action
    {
        return Action::make('deposit')
            ->label('Entrée')
            ->tooltip('Entrée')
            ->icon(Heroicon::OutlinedArrowDownTray)
            ->color('success')
            ->iconButton()
            ->schema([
                DatePicker::make('date')
                    ->label('Date')
                    ->default(now())
                    ->required(),
                TextInput::make('amount')
                    ->label('Montant (DZD)')
                    ->numeric()
                    ->minValue(1)
                    ->required(),
                TextInput::make('remark')
                    ->label('Remarque')
                    ->maxLength(255),
            ])
            ->modalHeading('Entrée')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Wallet $record, array $data): void {
                try {
                    app(DepositToWalletService::class)->execute($record, $data);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Entrée enregistrée')
                    ->success()
                    ->send();
            });
    }

    protected static function withdrawAction(): Action
    {
        return Action::make('withdraw')
            ->label('Sortie')
            ->tooltip('Sortie')
            ->icon(Heroicon::OutlinedBuildingLibrary)
            ->color('danger')
            ->iconButton()
            ->schema([
                DatePicker::make('date')
                    ->label('Date')
                    ->default(now())
                    ->required(),
                TextInput::make('amount')
                    ->label('Montant (DZD)')
                    ->numeric()
                    ->minValue(1)
                    ->required(),
                TextInput::make('remark')
                    ->label('Remarque')
                    ->maxLength(255),
            ])
            ->modalHeading('Sortie')
            ->modalSubmitActionLabel('Créer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (Wallet $record, array $data): void {
                try {
                    app(WithdrawFromWalletService::class)->execute($record, $data);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Sortie enregistrée')
                    ->success()
                    ->send();
            });
    }

    protected static function viewTransactionsAction(): Action
    {
        return Action::make('viewTransactions')
            ->label('Transactions')
            ->tooltip('Transactions')
            ->icon(Heroicon::OutlinedListBullet)
            ->color('info')
            ->iconButton()
            ->url(fn (Wallet $record) => route(
                'filament.admin.pages.finances.portefeuilles.{wallet}.transactions',
                ['wallet' => $record]
            ));
    }

    protected static function transferAction(): Action
    {
        return Action::make('transfer')
            ->label('Créer un transfert')
            ->icon(Heroicon::OutlinedArrowsRightLeft)
            ->schema([
                DatePicker::make('date')
                    ->label('Date')
                    ->default(now())
                    ->required(),
                Select::make('from_wallet_id')
                    ->label('De (Portefeuille)')
                    ->placeholder('Portefeuille')
                    ->options(fn () => Wallet::query()->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->live()
                    ->required(),
                Select::make('to_wallet_id')
                    ->label('À (Portefeuille)')
                    ->placeholder('Portefeuille')
                    ->options(fn (Get $get) => Wallet::query()
                        ->when($get('from_wallet_id'), fn ($query, $fromWalletId) => $query->whereKeyNot($fromWalletId))
                        ->pluck('name', 'id'))
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('amount')
                    ->label('Montant (DZD)')
                    ->numeric()
                    ->minValue(1)
                    ->required(),
                TextInput::make('remark')
                    ->label('Remarque')
                    ->maxLength(255),
            ])
            ->modalHeading('Créer un transfert')
            ->modalSubmitActionLabel('Transférer')
            ->modalCancelActionLabel('Fermer')
            ->action(function (array $data): void {
                try {
                    app(TransferBetweenWalletsService::class)->execute($data);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Transfert effectué')
                    ->success()
                    ->send();
            });
    }
}
