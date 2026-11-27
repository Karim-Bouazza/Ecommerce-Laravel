<?php

use App\Http\Controllers\Api\Order\OrderController;
use Illuminate\Support\Facades\Route;

Route::controller(OrderController::class)
    ->prefix('orders')
    ->name('orders.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('permission:orders.view')
            ->name('index');

        Route::get('/generate-name', 'generateName')
            ->middleware('permission:orders.create|orders.edit')
            ->name('generate-name');

        Route::post('/manual', 'storeManual')
            ->middleware('can:orders.create')
            ->name('store-manual');

        Route::get('/{order}', 'show')
            ->middleware('can:orders.view')
            ->name('show');

        Route::put('/{order}', 'update')
            ->middleware('can:orders.edit')
            ->name('update');

        Route::patch('/{order}/status', 'updateStatus')
            ->middleware('can:orders.edit')
            ->name('update-status');

        Route::get('/{order}/status-history', 'statusHistory')
            ->middleware('can:orders.view')
            ->name('status-history');

        Route::delete('/{order}', 'destroy')
            ->middleware('can:orders.delete')
            ->name('destroy');
    });
