<?php

namespace App\Services\Providers;

use App\Models\Order;
use App\Services\Providers\Concerns\CallsZimouApi;

class ZimouPackageService
{
    use CallsZimouApi;

    /**
     * @return array<string, mixed>
     */
    public function createPackage(Order $order): array
    {
        $order->loadMissing('client');

        $response = $this->zimouRequest()
            ->post('/packages', [
                'type' => 'ecommerce',
                'name' => $order->name,
                'client_first_name' => $order->client?->first_name,
                'client_last_name' => $order->client?->last_name,
                'client_phone' => $order->client?->phone_number,
                'address' => $order->address,
                'order_id' => $order->provider_order_id,
                'price' => (int) $order->subtotal,
                'free_delivery' => (int) $order->free_delivery,
                'delivery_type' => $order->delivery_type->value,
                'wilaya' => $order->provider_wilaya_id,
                'commune' => $order->provider_commune_id,
                'can_be_opened' => (int) $order->can_be_opened,
            ])
            ->throw();

        return $response->json();
    }
}
