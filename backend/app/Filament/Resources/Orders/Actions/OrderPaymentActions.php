<?php

namespace App\Filament\Resources\Orders\Actions;

use App\Enums\PaymentStatus;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;

class OrderPaymentActions
{
    public static function markAsPaid(): Action
    {
        return Action::make('markAsPaid')
            ->label('Marquer comme payée')
            ->icon(Heroicon::OutlinedBanknotes)
            ->color('success')
            ->requiresConfirmation()
            ->visible(fn (Order $record) => $record->payment_status === PaymentStatus::Unpaid)
            ->action(function (Order $record): void {
                $record->update(['payment_status' => PaymentStatus::Paid]);

                Notification::make()
                    ->title('Commande marquée comme payée')
                    ->success()
                    ->send();
            });
    }
}
