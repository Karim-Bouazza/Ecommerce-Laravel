<?php

use App\Http\Controllers\Api\Order\ClientController;
use App\Http\Controllers\Api\Order\OrderController;
use Illuminate\Support\Facades\Route;

Route::controller(ClientController::class)
    ->prefix('clients')
    ->name('clients.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:clients.view')
            ->name('index');

        Route::get('/blacklist', 'blacklisted')
            ->middleware('can:clients_blacklist.view')
            ->name('blacklist');

        Route::put('/{client}', 'update')
            ->middleware('can:clients.edit')
            ->name('update');

        Route::delete('/{client}', 'destroy')
            ->middleware('can:clients.delete')
            ->name('destroy');

        Route::post('/{client}/toggle-blacklist', 'toggleBlacklist')
            ->middleware('can:clients.edit')
            ->name('toggle-blacklist');
    });

Route::controller(OrderController::class)
    ->prefix('orders')
    ->name('orders.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('permission:orders.view|orders_nouvelles.view|orders_en_cours.view|orders_confirmees.view|orders_terminees.view|orders_annulees.view')
            ->name('index');

        Route::get('/generate-name', 'generateName')
            ->middleware('permission:orders.create|orders.edit')
            ->name('generate-name');

        Route::post('/manual', 'storeManual')
            ->middleware('can:orders.create')
            ->name('store-manual');

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
