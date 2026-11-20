<?php

use App\Http\Controllers\Api\Delivery\DeliveryCompanyIntegrationController;
use App\Http\Controllers\Api\Delivery\DeliveryCompanyOptionController;
use App\Http\Controllers\Api\Delivery\ProviderDeliveryPriceController;
use App\Http\Controllers\Api\Delivery\ProviderStopDeskController;
use Illuminate\Support\Facades\Route;

Route::get('/provider-stopdesks', [ProviderStopDeskController::class, 'index'])->name('provider-stopdesks.index');

Route::post('/provider-delivery-price/calculate-package', [ProviderDeliveryPriceController::class, 'calculatePackage'])
    ->middleware('permission:orders.create|orders.edit')
    ->name('provider-delivery-price.calculate-package');

Route::get('/delivery-companies', [DeliveryCompanyOptionController::class, 'index'])
    ->middleware('permission:orders.create|orders.edit')
    ->name('delivery-companies.index');

Route::controller(DeliveryCompanyIntegrationController::class)
    ->prefix('partners/integrations')
    ->name('partners.integrations.')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{companyKey}', 'show')->name('show');
        Route::put('/{companyKey}', 'update')->name('update');
        Route::delete('/{companyKey}', 'destroy')->name('destroy');
    });
