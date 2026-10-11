<?php

namespace App\Services\Telegram;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class TelegramClient
{
    /**
     * Sends an HTML message to the configured chat. Never throws: a Telegram
     * outage must not affect the caller (e.g. order creation).
     */
    public function sendMessage(string $html): bool
    {
        $token = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            return false;
        }

        try {
            $response = Http::timeout(10)->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $html,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);

            if ($response->failed()) {
                Log::warning('Telegram sendMessage failed', ['status' => $response->status(), 'body' => $response->body()]);
            }

            return $response->successful();
        } catch (Throwable $e) {
            Log::warning('Telegram sendMessage error', ['message' => $e->getMessage()]);

            return false;
        }
    }
}
