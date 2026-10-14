<?php

namespace App\Jobs;

use App\Models\Order\Order;
use App\Services\Telegram\OrderTelegramMessage;
use App\Services\Telegram\TelegramClient;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Dispatched with dispatchAfterResponse(): runs once the HTTP response has been
 * sent, so the customer never waits on Telegram and no queue worker is needed.
 */
class SendOrderToTelegram
{
    use Dispatchable, SerializesModels;

    public function __construct(public readonly Order $order) {}

    public function handle(TelegramClient $telegram, OrderTelegramMessage $message): void
    {
        $telegram->sendMessage($message->build($this->order));
    }
}
