<?php

namespace App\Filament\Resources\Orders\Actions;

use App\Models\Order;
use App\Services\OrderDeletionOtpService;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Exceptions\Halt;
use Filament\Support\Icons\Heroicon;
use RuntimeException;

class OrderDeleteAction
{
    public static function make(): Action
    {
        return Action::make('deleteWithOtp')
            ->label('Supprimer')
            ->icon(Heroicon::OutlinedTrash)
            ->color('danger')
            ->modalHeading('Confirmer la suppression de la commande')
            ->modalDescription('Un code de vérification à 6 chiffres a été envoyé par email. Saisissez-le pour confirmer la suppression.')
            ->modalSubmitActionLabel('Confirmer la suppression')
            ->schema([
                TextInput::make('otp')
                    ->label('Code de vérification')
                    ->required()
                    ->numeric()
                    ->length(6)
                    ->autofocus(),
            ])
            ->mountUsing(function (Order $record): void {
                try {
                    app(OrderDeletionOtpService::class)->send($record, auth()->id());

                    Notification::make()
                        ->title('Code envoyé')
                        ->body('Un code de vérification a été envoyé par email.')
                        ->success()
                        ->send();
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title("Impossible d'envoyer le code")
                        ->body($exception->getMessage())
                        ->danger()
                        ->send();
                }
            })
            ->action(function (Order $record, array $data): void {
                $verified = app(OrderDeletionOtpService::class)->verify(
                    $record,
                    auth()->id(),
                    (string) $data['otp']
                );

                if (! $verified) {
                    Notification::make()
                        ->title('Code invalide ou expiré')
                        ->danger()
                        ->send();

                    throw new Halt();
                }

                $record->delete();

                Notification::make()
                    ->title('Commande supprimée')
                    ->success()
                    ->send();
            });
    }
}
