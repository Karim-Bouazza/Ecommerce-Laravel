<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderNote;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderPlaced;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class CreateOrderService
{
    public function execute(array $data): Order
    {
        $order = $this->createOrder($data);

        // Notifying admins is a side effect of order creation, not part of
        // its consistency guarantees, so it runs after the transaction commits.
        Notification::send(User::all(), new NewOrderPlaced($order));

        return $order;
    }

    private function createOrder(array $data): Order
    {
        $attempts = 0;

        while (true) {
            try {
                return DB::transaction(function () use ($data) {
                    $client = Client::updateOrCreate(
                        ['phone_number' => $data['phone_number']],
                        [
                            'first_name' => $data['first_name'],
                            'last_name' => $data['last_name'],
                            'wilaya_id' => $data['wilaya_id'],
                            'commune_id' => $data['commune_id'],
                        ]
                    );

                    $order = Order::create([
                        'client_id' => $client->id,
                        'reference' => $this->generateReference(),
                        'status' => OrderStatus::Pending,
                        'subtotal' => 0,
                        'delivery_price' => $data['delivery_price'] ?? 0,
                        'total_price' => 0,
                    ]);

                    $subtotal = 0;

                    foreach ($data['items'] as $item) {
                        $product = Product::findOrFail($item['product_id']);

                        $quantity = $item['quantity'];
                        $unitPrice = $product->price;
                        $itemTotal = $unitPrice * $quantity;

                        $order->items()->create([
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'quantity' => $quantity,
                            'price' => $unitPrice,
                            'total_price' => $itemTotal,
                        ]);

                        $subtotal += $itemTotal;
                    }

                    $order->update([
                        'subtotal' => $subtotal,
                        'total_price' => $subtotal + $order->delivery_price,
                    ]);

                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'user_id' => null,
                    ]);

                    if (! empty($data['note'])) {
                        OrderNote::create([
                            'order_id' => $order->id,
                            'user_id' => null,
                            'content' => $data['note'],
                        ]);
                    }

                    return $order->load([
                        'client.wilaya',
                        'client.commune',
                        'items',
                        'statusHistories',
                        'notes',
                    ]);
                });
            } catch (QueryException $exception) {
                $isDuplicateReference = $exception->getCode() === '23000'
                    && str_contains($exception->getMessage(), 'orders_reference_unique');

                if (! $isDuplicateReference || ++$attempts >= 5) {
                    throw $exception;
                }
            }
        }
    }

    private function generateReference(): string
    {
        $today = now();

        $sequence = Order::whereDate('created_at', $today->toDateString())->count() + 1;

        return sprintf('%s/%06d', $today->format('Y/m/d'), $sequence);
    }
}
