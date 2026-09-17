<?php

namespace App\Services\Orders;

use App\Enums\DeliveryType;
use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use App\Services\Providers\ZimouWilayaService;
use Illuminate\Support\Facades\DB;

class UpdateOrderService
{
    public function __construct(private readonly ZimouWilayaService $zimouWilayaService)
    {
    }

    public function execute(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $client = Client::updateOrCreate(
                ['phone_number' => $data['phone_number']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'wilaya_id' => $data['wilaya_id'],
                    'commune_id' => $data['commune_id'] ?? null,
                ]
            );

            $existingItemIds = $order->items()->pluck('id')->all();
            $keptItemIds = [];
            $subtotal = 0;

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                $quantity = (int) $item['quantity'];
                $unitPrice = isset($item['unit_price']) && $item['unit_price'] !== ''
                    ? (int) $item['unit_price']
                    : $product->price;
                $itemTotal = $unitPrice * $quantity;

                $attributes = [
                    'product_id' => $product->id,
                    'warehouse_id' => $item['warehouse_id'] ?? null,
                    'product_name' => $product->name,
                    'variant' => $item['variant'] ?? null,
                    'quantity' => $quantity,
                    'price' => $unitPrice,
                    'total_price' => $itemTotal,
                ];

                if (! empty($item['id']) && in_array($item['id'], $existingItemIds, true)) {
                    $order->items()->whereKey($item['id'])->update($attributes);
                    $keptItemIds[] = $item['id'];
                } else {
                    $keptItemIds[] = $order->items()->create($attributes)->id;
                }

                $subtotal += $itemTotal;
            }

            $order->items()->whereNotIn('id', $keptItemIds)->delete();

            $deliveryPrice = (int) ($data['delivery_price'] ?? 0);

            $order->update([
                'client_id' => $client->id,
                'scheduled_at' => $data['scheduled_at'] ?? $order->scheduled_at,
                'delivery_price' => $deliveryPrice,
                'delivery_type' => $data['delivery_type'] ?? DeliveryType::Express->value,
                'stop_desk_company_id' => $data['stop_desk_company_id'] ?? null,
                'address' => $this->resolveAddress($data, $client) ?? $order->address,
                'provider_wilaya_id' => $data['provider_wilaya_id'] ?? $order->provider_wilaya_id,
                'provider_commune_id' => $data['provider_commune_id'] ?? $order->provider_commune_id,
                'provider_office_id' => $data['provider_office_id'] ?? $order->provider_office_id,
                'delivery_note' => $data['delivery_note'] ?? $order->delivery_note,
                'name' => $data['name'] ?? $order->name,
                'provider_order_id' => $data['provider_order_id'] ?? $order->provider_order_id,
                'free_delivery' => $data['free_delivery'] ?? $order->free_delivery,
                'can_be_opened' => $data['can_be_opened'] ?? $order->can_be_opened,
                'subtotal' => $subtotal,
                'total_price' => $subtotal + $deliveryPrice,
            ]);

            return $order->fresh(['client.wilaya', 'client.commune', 'items.warehouse']);
        });
    }

    private function resolveAddress(array $data, Client $client): ?string
    {
        $address = trim((string) ($data['address'] ?? ''));

        if ($address !== '') {
            return $address;
        }

        return $this->resolveProviderWilayaName($data['provider_wilaya_id'] ?? null)
            ?? $client->loadMissing('wilaya')->wilaya?->name;
    }

    private function resolveProviderWilayaName(?int $providerWilayaId): ?string
    {
        if (! $providerWilayaId) {
            return null;
        }

        $wilaya = collect($this->zimouWilayaService->fetchWilayas())
            ->firstWhere('id', $providerWilayaId);

        return $wilaya['name'] ?? null;
    }
}
