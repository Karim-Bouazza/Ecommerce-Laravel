<?php

use App\Http\Controllers\Api\Inventory\StockAlertController;
use App\Http\Controllers\Api\Inventory\StockController;
use App\Http\Controllers\Api\Inventory\StockMovementController;
use App\Http\Controllers\Api\Inventory\TransferController;
use App\Http\Controllers\Api\Inventory\WarehouseController;
use App\Http\Controllers\Api\Inventory\WarehouseProductOptionController;
use Illuminate\Support\Facades\Route;

Route::controller(WarehouseController::class)
    ->prefix('warehouses')
    ->name('warehouses.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:entrepots.view')
            ->name('index');

        Route::get('/options', 'options')
            ->middleware('permission:stock.view|suivi_stock.view|orders.create|orders.edit')
            ->name('options');

        Route::get('/{warehouse}', 'show')
            ->middleware('can:entrepots.edit')
            ->whereNumber('warehouse')
            ->name('show');

        Route::post('/', 'store')
            ->middleware('can:entrepots.create')
            ->name('store');

        Route::patch('/{warehouse}', 'update')
            ->middleware('can:entrepots.edit')
            ->name('update');

        Route::delete('/{warehouse}', 'destroy')
            ->middleware('can:entrepots.delete')
            ->name('destroy');

        Route::post('/{warehouse}/toggle-active', 'toggleActive')
            ->middleware('can:entrepots.edit')
            ->name('toggle-active');

        Route::get('/{warehouse}/product-options', [WarehouseProductOptionController::class, 'index'])
            ->middleware('permission:transferts.create|orders.create|orders.edit')
            ->name('product-options');
    });

Route::controller(StockController::class)
    ->prefix('stock')
    ->name('stock.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:stock.view')
            ->name('index');

        Route::get('/stats', 'stats')
            ->middleware('can:stock.view')
            ->name('stats');

        Route::post('/{product}/adjust', 'adjust')
            ->middleware('can:stock.view')
            ->name('adjust');
    });

Route::get('/stock-movements', [StockMovementController::class, 'index'])
    ->middleware('can:suivi_stock.view')
    ->name('stock-movements.index');

Route::get('/stock-alerts', [StockAlertController::class, 'index'])
    ->middleware('can:alerte_stock.view')
    ->name('stock-alerts.index');

Route::controller(TransferController::class)
    ->prefix('transfers')
    ->name('transfers.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:transferts.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:transferts.create')
            ->name('store');

        Route::post('/{transfer}/confirm', 'confirm')
            ->middleware('can:transferts.edit')
            ->name('confirm');

        Route::delete('/{transfer}', 'destroy')
            ->middleware('can:transferts.delete')
            ->name('destroy');
    });
