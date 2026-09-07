<?php

namespace App\Services\Orders;

use App\Enums\DeliveryType;
use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class UpdateOrderService
{
    public function execute(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $client = Client::updateOrCreate(
                ['phone_number' => $data['phone_number']],
                [
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'wilaya_id' => $data['wilaya_id'],
                    'commune_id' => $data['commune_id'],
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
                'delivery_type' => $data['delivery_type'] ?? DeliveryType::Domicile->value,
                'stop_desk_company_id' => $data['stop_desk_company_id'] ?? null,
                'subtotal' => $subtotal,
                'total_price' => $subtotal + $deliveryPrice,
            ]);

            return $order->fresh(['client.wilaya', 'client.commune', 'items']);
        });
    }
}
