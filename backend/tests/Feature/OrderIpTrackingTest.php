<?php

use App\Enums\OrderType;
use App\Models\Order;
use App\Models\Product;
use App\Models\Wilaya;
use App\Services\Orders\CreateOrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function orderIpTestProduct(): Product
{
    return Product::create([
        'name' => 'Test product',
        'description' => 'Test product description',
        'price' => 1000,
        'stock' => 10,
        'image_1' => 'test.jpg',
    ]);
}

function orderIpTestWilaya(): Wilaya
{
    return Wilaya::create([
        'name' => 'Test Wilaya',
        'code' => 999,
    ]);
}

function orderIpTestData(Product $product, Wilaya $wilaya): array
{
    return [
        'first_name' => 'Test',
        'last_name' => 'Customer',
        'phone_number' => '0555000000',
        'wilaya_id' => $wilaya->id,
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
            ],
        ],
    ];
}

test('a storefront order stores the server detected IP and hides it from the public response', function () {
    /** @var Tests\TestCase $this */
    Notification::fake();

    $product = orderIpTestProduct();
    $wilaya = orderIpTestWilaya();

    $originalRemoteAddress = $_SERVER['REMOTE_ADDR'] ?? null;
    $_SERVER['REMOTE_ADDR'] = '203.0.113.10';

    try {
        $response = $this->postJson('/api/v1/orders', [
            ...orderIpTestData($product, $wilaya),
            'ip_address' => '198.51.100.20',
        ]);
    } finally {
        if ($originalRemoteAddress === null) {
            unset($_SERVER['REMOTE_ADDR']);
        } else {
            $_SERVER['REMOTE_ADDR'] = $originalRemoteAddress;
        }
    }

    $response
        ->assertCreated()
        ->assertJsonStructure(['id', 'reference'])
        ->assertJsonMissingPath('ip_address');

    $order = Order::query()->latest('id')->first();

    expect($order->ip_address)->toBe('203.0.113.10')
        ->and($order->name)->toBe('Test product')
        ->and($order->provider_order_id)->toBe('Test product');
});

test('a manual order does not automatically receive an IP', function () {
    Notification::fake();

    $product = orderIpTestProduct();
    $wilaya = orderIpTestWilaya();

    $order = app(CreateOrderService::class)->execute([
        ...orderIpTestData($product, $wilaya),
        'type' => OrderType::Manuelle->value,
    ]);

    expect($order->ip_address)->toBeNull();
});
