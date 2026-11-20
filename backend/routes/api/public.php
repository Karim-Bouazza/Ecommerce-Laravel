<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Delivery\ProviderCommuneController;
use App\Http\Controllers\Api\Delivery\ProviderDeliveryPriceController;
use App\Http\Controllers\Api\Delivery\ProviderWilayaController;
use App\Http\Controllers\Api\Delivery\WilayaController;
use App\Http\Controllers\Api\Marketing\PixelController;
use App\Http\Controllers\Api\Order\OrderController;
use App\Http\Controllers\Api\Settings\SiteSettingLanguageController;
use App\Http\Controllers\Api\Storefront\StorefrontCategoryController;
use App\Http\Controllers\Api\Storefront\StorefrontFeatureController;
use App\Http\Controllers\Api\Storefront\StorefrontHeroCategoryController;
use App\Http\Controllers\Api\Storefront\StorefrontProductController;
use App\Http\Controllers\Api\Storefront\StorefrontPromoBannerController;
use App\Http\Controllers\Api\Storefront\StorefrontSectionProductController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

Route::get('/wilayas', [WilayaController::class, 'index'])->name('wilayas.index');
Route::get('/provider-wilayas', [ProviderWilayaController::class, 'index'])->name('provider-wilayas.index');
Route::get('/provider-communes', [ProviderCommuneController::class, 'index'])->name('provider-communes.index');
Route::get('/provider-delivery-price/home', [ProviderDeliveryPriceController::class, 'home'])->name('provider-delivery-price.home');

Route::post('/orders', [OrderController::class, 'store'])->name('orders.store-public');

Route::get('/site-settings/language', [SiteSettingLanguageController::class, 'show'])->name('site-settings.language.show');
Route::get('/site-settings/hero-categories', [StorefrontHeroCategoryController::class, 'index'])->name('site-settings.hero-categories.index');

Route::prefix('storefront')->name('storefront.')->group(function () {
    Route::get('/sections/{section}/products', [StorefrontSectionProductController::class, 'index'])->name('sections.products.index');
    Route::get('/features', [StorefrontFeatureController::class, 'index'])->name('features.index');
    Route::get('/promo-banners', [StorefrontPromoBannerController::class, 'index'])->name('promo-banners.index');
    Route::get('/products', [StorefrontProductController::class, 'index'])->name('products.index');
    Route::get('/products/deals-of-the-day', [StorefrontProductController::class, 'deals'])->name('products.deals');
    Route::get('/products/{product}', [StorefrontProductController::class, 'show'])->name('products.show');
    Route::get('/categories', [StorefrontCategoryController::class, 'index'])->name('categories.index');
});

Route::get('/pixels/active', [PixelController::class, 'active'])->name('pixels.active');
