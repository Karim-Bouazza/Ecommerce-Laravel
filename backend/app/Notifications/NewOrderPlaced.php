<?php

namespace App\Notifications;

use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Notifications\Notification;

class NewOrderPlaced extends Notification
{
    public function __construct(
        private readonly Order $order,
    )
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $clientName = trim($this->order->client->first_name.' '.$this->order->client->last_name);

        return FilamentNotification::make()
            ->title('New order placed')
            ->body(sprintf('%s placed order %s for %s DA', $clientName, $this->order->reference, number_format($this->order->total_price)))
            ->icon('heroicon-o-shopping-bag')
            ->iconColor('success')
            ->actions([
                Action::make('view')
                    ->label('View order')
                    ->url(OrderResource::getUrl('view', ['record' => $this->order]))
                    ->markAsRead(),
            ])
            ->getDatabaseMessage();
    }
}
