<?php

namespace App\Filament\Resources\Orders\Actions;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Services\Orders\MarkOrderAsPaidService;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use RuntimeException;

class OrderPaymentActions
{
    public static function markAsPaid(): Action
    {
        return Action::make('markAsPaid')
            ->label('Marquer comme payée')
            ->icon(Heroicon::OutlinedBanknotes)
            ->color('success')
            ->requiresConfirmation()
            ->visible(fn (Order $record) => $record->payment_status === PaymentStatus::Unpaid
                && $record->status === OrderStatus::Delivered)
            ->action(function (Order $record): void {
                try {
                    app(MarkOrderAsPaidService::class)->execute($record);
                } catch (RuntimeException $exception) {
                    Notification::make()
                        ->title($exception->getMessage())
                        ->danger()
                        ->send();

                    return;
                }

                Notification::make()
                    ->title('Commande marquée comme payée')
                    ->success()
                    ->send();
            });
    }
}
