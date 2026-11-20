<?php

use App\Http\Controllers\Api\Marketing\MetaAdsController;
use App\Http\Controllers\Api\Marketing\PixelController;
use App\Http\Controllers\Api\Marketing\PixelExcludedIpController;
use Illuminate\Support\Facades\Route;

Route::controller(PixelController::class)
    ->prefix('pixels')
    ->name('pixels.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:pixels.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:pixels.create')
            ->name('store');

        Route::put('/{pixel}', 'update')
            ->middleware('can:pixels.edit')
            ->name('update');

        Route::delete('/{pixel}', 'destroy')
            ->middleware('can:pixels.delete')
            ->name('destroy');

        Route::post('/{pixel}/toggle-active', 'toggleActive')
            ->middleware('can:pixels.edit')
            ->name('toggle-active');
    });

Route::controller(PixelExcludedIpController::class)
    ->prefix('pixel-excluded-ips')
    ->name('pixel-excluded-ips.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:pixels.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:pixels.create')
            ->name('store');

        Route::delete('/{pixelExcludedIp}', 'destroy')
            ->middleware('can:pixels.delete')
            ->name('destroy');
    });

Route::controller(MetaAdsController::class)
    ->prefix('meta')
    ->name('meta.')
    ->group(function () {
        Route::get('/connection', 'connection')
            ->middleware('can:meta_ads.view')
            ->name('connection');

        Route::put('/app', 'saveApp')
            ->middleware('can:meta_ads.edit')
            ->name('save-app');

        Route::get('/connect', 'connect')
            ->middleware('can:meta_ads.edit')
            ->name('connect');

        Route::post('/callback', 'callback')
            ->middleware('can:meta_ads.edit')
            ->name('callback');

        Route::put('/ad-account', 'selectAdAccount')
            ->middleware('can:meta_ads.edit')
            ->name('select-ad-account');

        Route::post('/test', 'test')
            ->middleware('can:meta_ads.edit')
            ->name('test');

        Route::delete('/connection', 'disconnect')
            ->middleware('can:meta_ads.edit')
            ->name('disconnect');

        Route::get('/spend', 'spend')
            ->middleware('can:meta_ads.view')
            ->name('spend');

        Route::put('/campaigns/{campaignId}', 'linkCampaign')
            ->middleware('can:meta_ads.edit')
            ->name('link-campaign');
    });
