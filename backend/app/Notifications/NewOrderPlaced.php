<?php

namespace App\Notifications;

use App\Models\Order\Order;
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

        return [
            'title' => 'New order placed',
            'body' => sprintf('%s placed order %s for %s DA', $clientName, $this->order->reference, number_format($this->order->total_price)),
            'order_id' => $this->order->id,
        ];
    }
}
