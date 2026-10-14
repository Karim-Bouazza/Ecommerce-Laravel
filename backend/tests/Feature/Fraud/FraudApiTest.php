<?php

use App\Models\Order\Order;
use App\Models\Catalog\Product;
use App\Models\Auth\Role;
use App\Models\Users\User;
use App\Models\Delivery\Wilaya;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function fraudApiUser(array $permissions): User
{
    $role = Role::forceCreate([
        'name' => 'R'.uniqid(), 'slug' => 'r'.uniqid(), 'permissions' => $permissions, 'is_system' => false,
    ]);

    return User::factory()->create(['role_id' => $role->id]);
}

function fraudApiOrder($test): Order
{
    Notification::fake();
    $product = Product::create(['name' => 'P', 'description' => 'd', 'price' => 1000, 'stock' => 5, 'image_1' => 'a.jpg']);
    $wilaya = Wilaya::create(['name' => 'W', 'code' => 998]);

    $id = $test->withServerVariables(['REMOTE_ADDR' => '203.0.113.50'])->postJson('/api/v1/orders', [
        'first_name' => 'A', 'last_name' => 'B', 'phone_number' => '0555123456',
        'wilaya_id' => $wilaya->id, 'fingerprint' => 'fp',
        'items' => [['product_id' => $product->id, 'quantity' => 1]],
    ])->assertCreated()->json('id');

    return Order::findOrFail($id);
}

test('staff without sensitive permission get masked phone and no IP', function () {
    $order = fraudApiOrder($this);

    $this->actingAs(fraudApiUser(['fraud.view']), 'sanctum')
        ->getJson('/api/v1/fraud/assessments')
        ->assertOk()
        ->assertJsonPath('data.0.ip_address', null)
        ->assertJsonPath('data.0.customer_phone', '05•••••456');

    $this->actingAs(fraudApiUser(['fraud.view', 'fraud.view_sensitive']), 'sanctum')
        ->getJson("/api/v1/fraud/assessments/{$order->id}")
        ->assertOk()
        ->assertJsonPath('ip_address', '203.0.113.50')
        ->assertJsonPath('customer_phone', '0555123456');
});

test('reviewing requires permission and a reason, and records the reviewer', function () {
    $order = fraudApiOrder($this);
    $url = "/api/v1/fraud/assessments/{$order->id}/review";

    $this->actingAs(fraudApiUser(['fraud.view']), 'sanctum')
        ->postJson($url, ['label' => 'CONFIRMED_FAKE', 'reason' => 'x'])->assertForbidden();

    $reviewer = fraudApiUser(['fraud.review']);
    $this->actingAs($reviewer, 'sanctum')->postJson($url, ['label' => 'CONFIRMED_FAKE'])->assertUnprocessable();

    $this->actingAs($reviewer, 'sanctum')
        ->postJson($url, ['label' => 'CONFIRMED_FAKE', 'reason' => 'Customer denied ordering'])
        ->assertOk()
        ->assertJsonPath('label', 'CONFIRMED_FAKE')
        ->assertJsonPath('reviewed_by', $reviewer->name);

    expect($order->fresh()->status->value)->toBe('pending');
});
