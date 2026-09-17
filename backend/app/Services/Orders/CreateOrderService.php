<?php

namespace App\Services\Orders;

use App\Enums\DeliveryType;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Models\Client;
use App\Models\Order;
use App\Models\OrderNote;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderPlaced;
use App\Services\Providers\ZimouWilayaService;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class CreateOrderService
{
    public function __construct(private readonly ZimouWilayaService $zimouWilayaService)
    {
    }

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
                            'commune_id' => $data['commune_id'] ?? null,
                        ]
                    );

                    $order = Order::create([
                        'client_id' => $client->id,
                        'reference' => $this->generateReference(),
                        'status' => OrderStatus::New,
                        'type' => $data['type'] ?? OrderType::Ads,
                        'subtotal' => 0,
                        'delivery_price' => $data['delivery_price'] ?? 0,
                        'delivery_type' => $data['delivery_type'] ?? DeliveryType::Express->value,
                        'stop_desk_company_id' => $data['stop_desk_company_id'] ?? null,
                        'address' => $this->resolveAddress($data, $client),
                        'provider_wilaya_id' => $data['provider_wilaya_id'] ?? null,
                        'provider_commune_id' => $data['provider_commune_id'] ?? null,
                        'provider_office_id' => $data['provider_office_id'] ?? null,
                        'delivery_note' => $data['delivery_note'] ?? null,
                        'name' => $data['name'] ?? null,
                        'provider_order_id' => $data['provider_order_id'] ?? null,
                        'free_delivery' => $data['free_delivery'] ?? false,
                        'can_be_opened' => $data['can_be_opened'] ?? false,
                        'total_price' => 0,
                        'created_at' => $data['created_at'] ?? now(),
                    ]);

                    $subtotal = 0;

                    foreach ($data['items'] as $item) {
                        $product = Product::findOrFail($item['product_id']);

                        $quantity = $item['quantity'];
                        $unitPrice = isset($item['unit_price']) && $item['unit_price'] !== ''
                            ? (int) $item['unit_price']
                            : $product->price;
                        $itemTotal = $unitPrice * $quantity;

                        $order->items()->create([
                            'product_id' => $product->id,
                            'warehouse_id' => $item['warehouse_id'] ?? null,
                            'product_name' => $product->name,
                            'variant' => $item['variant'] ?? null,
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
                        'items.warehouse',
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

    private function resolveAddress(array $data, Client $client): ?string
    {
        $address = trim((string) ($data['address'] ?? ''));

        if ($address !== '') {
            return $address;
        }

        $wilayaName = $this->resolveProviderWilayaName($data['provider_wilaya_id'] ?? null)
            ?? $client->loadMissing('wilaya')->wilaya?->name;

        return $wilayaName;
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

    private function generateReference(): string
    {
        $today = now();

        $sequence = Order::whereDate('created_at', $today->toDateString())->count() + 1;

        return sprintf('%s/0%d', $today->format('Y/m/d'), $sequence);
    }
}
