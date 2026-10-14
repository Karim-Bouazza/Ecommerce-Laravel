<?php

use App\Models\Catalog\Product;
use App\Models\Storefront\StorefrontFeature;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function storefrontTestProduct(string $name, bool $active = true): Product
{
    return Product::create([
        'name' => $name,
        'description' => 'Description',
        'price' => 1000,
        'compare_price' => 1500,
        'stock' => 10,
        'image_1' => 'test.jpg',
        'is_active' => $active,
    ]);
}

function storefrontTestImage(): UploadedFile
{
    // 1×1 transparent PNG, so the test does not need GD.
    return UploadedFile::fake()->createWithContent(
        'image.png',
        base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    );
}

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create(), 'sanctum');
});

it('manages the products of a homepage section', function () {
    $first = storefrontTestProduct('Caméra');
    $second = storefrontTestProduct('Alarme');
    $hidden = storefrontTestProduct('Inactif', active: false);
    $base = '/api/v1/site-settings/sections/new_arrivals/products';

    $this->postJson($base, ['product_id' => $first->id, 'label' => 'Nouvelle Gamme'])->assertCreated();
    $this->postJson($base, ['product_id' => $second->id])->assertCreated();
    $this->postJson($base, ['product_id' => $hidden->id])->assertCreated();
    $this->postJson($base, ['product_id' => $first->id])->assertUnprocessable();

    // Same product may appear in another section.
    $this->postJson('/api/v1/site-settings/sections/best_offers/products', ['product_id' => $first->id])->assertCreated();

    $ids = collect($this->getJson($base)->json())->pluck('id');
    $this->putJson("$base/order", ['ids' => [$ids[1], $ids[0]]])->assertOk();

    $public = $this->getJson('/api/v1/storefront/sections/new_arrivals/products')->assertOk()->json();
    expect(collect($public)->pluck('name')->all())->toBe(['Alarme', 'Caméra'])
        ->and($public[1]['label'])->toBe('Nouvelle Gamme')
        ->and($public[1]['discount_percentage'])->toBe(33);

    // An item cannot be edited through another section.
    $this->putJson("/api/v1/site-settings/sections/style_picks/products/{$ids[0]}", ['label' => 'x'])->assertNotFound();
    $this->deleteJson("$base/{$ids[0]}")->assertNoContent();
    $this->getJson('/api/v1/storefront/sections/unknown/products')->assertNotFound();
});

it('limits the number of products per section', function () {
    $base = '/api/v1/site-settings/sections/new_arrivals/products';

    foreach (range(1, 4) as $index) {
        $this->postJson($base, ['product_id' => storefrontTestProduct("P$index")->id])->assertCreated();
    }

    $this->postJson($base, ['product_id' => storefrontTestProduct('P5')->id])->assertUnprocessable();
});

it('manages the feature cards with their image', function () {
    $response = $this->post('/api/v1/site-settings/features', [
        'title' => 'Vision Nocturne',
        'description' => 'Jour et nuit',
        'image' => storefrontTestImage(),
    ], ['Accept' => 'application/json'])->assertCreated();

    $feature = StorefrontFeature::findOrFail($response->json('id'));
    $firstPath = $feature->image_path;
    Storage::disk('public')->assertExists($firstPath);

    $this->post("/api/v1/site-settings/features/{$feature->id}", [
        '_method' => 'PUT',
        'title' => 'Vision 4K',
        'image' => storefrontTestImage(),
    ], ['Accept' => 'application/json'])->assertOk();

    Storage::disk('public')->assertMissing($firstPath);
    expect($feature->fresh()->title)->toBe('Vision 4K');

    $this->deleteJson("/api/v1/site-settings/features/{$feature->id}")->assertNoContent();
    expect(StorefrontFeature::count())->toBe(0);
});

it('validates promo banner links and limits banners to two', function () {
    $payload = fn (array $extra = []) => [
        'title' => 'Collection Alarmes',
        'image' => storefrontTestImage(),
        ...$extra,
    ];
    $headers = ['Accept' => 'application/json'];

    $this->post('/api/v1/site-settings/promo-banners', $payload(['link_url' => 'javascript:alert(1)']), $headers)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('link_url');

    $this->post('/api/v1/site-settings/promo-banners', $payload(['link_url' => '/products', 'highlight' => '1']), $headers)
        ->assertCreated()
        ->assertJsonPath('highlight', true)
        ->assertJsonPath('button_label', 'Acheter');
    $this->post('/api/v1/site-settings/promo-banners', $payload(), $headers)->assertCreated();
    $this->post('/api/v1/site-settings/promo-banners', $payload(), $headers)->assertUnprocessable();

    expect($this->getJson('/api/v1/storefront/promo-banners')->json())->toHaveCount(2);
});
