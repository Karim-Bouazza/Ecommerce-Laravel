<?php

namespace App\Services\Telegram;

use App\Models\Order;

class OrderTelegramMessage
{
    public function build(Order $order): string
    {
        $order->loadMissing(['client.wilaya', 'client.commune', 'items']);
        $client = $order->client;

        $lines = [
            '🛒 <b>Nouvelle commande</b> '.$this->e($order->reference),
            '',
            '👤 Prénom : '.$this->e($client->first_name),
            '👤 Nom : '.$this->e($client->last_name),
            '📞 Téléphone : '.$this->e($client->phone_number),
            '🌐 IP : '.$this->e($order->ip_address ?? '—'),
            '',
            '📍 Wilaya : '.$this->e($client->wilaya?->name ?? '—'),
            '📍 Commune : '.$this->e($client->commune?->name ?? '—'),
            '🏠 Adresse : '.$this->e($order->address ?? '—'),
            '🚚 Type de livraison : '.$this->e($order->delivery_type?->label() ?? '—'),
            '',
            '📦 <b>Produits</b>',
        ];

        foreach ($order->items as $item) {
            $variant = trim((string) $item->variant);
            $lines[] = sprintf(
                '• %s%s — Qté : %d — Prix : %s DA',
                $this->e($item->product_name),
                $variant !== '' ? ' ('.$this->e($variant).')' : '',
                $item->quantity,
                $this->money($item->price),
            );
        }

        $lines[] = '';
        $lines[] = '💵 Prix produits : '.$this->money($order->subtotal).' DA';
        $lines[] = '🚚 Livraison : '.$this->money($order->delivery_price).' DA';
        $lines[] = '💰 <b>Prix total : '.$this->money($order->total_price).' DA</b>';

        return implode("\n", $lines);
    }

    private function e(?string $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    private function money(int|float|string|null $amount): string
    {
        return number_format((float) $amount, 0, ',', ' ');
    }
}
