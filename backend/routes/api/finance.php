<?php

use App\Http\Controllers\Api\Finance\PaiementController;
use App\Http\Controllers\Api\Finance\VersementController;
use App\Http\Controllers\Api\Finance\WalletController;
use Illuminate\Support\Facades\Route;

Route::controller(WalletController::class)
    ->prefix('wallets')
    ->name('wallets.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:portefeuilles.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:portefeuilles.create')
            ->name('store');

        Route::put('/{wallet}', 'update')
            ->middleware('can:portefeuilles.edit')
            ->name('update');

        Route::delete('/{wallet}', 'destroy')
            ->middleware('can:portefeuilles.delete')
            ->name('destroy');

        Route::post('/{wallet}/deposit', 'deposit')
            ->middleware('can:portefeuilles.deposit')
            ->name('deposit');

        Route::post('/{wallet}/withdraw', 'withdraw')
            ->middleware('can:portefeuilles.withdraw')
            ->name('withdraw');

        Route::get('/{wallet}/transactions', 'transactions')
            ->middleware('can:portefeuilles.view')
            ->name('transactions');

        Route::post('/transfer', 'transfer')
            ->middleware('can:portefeuilles.create')
            ->name('transfer');

        Route::get('/stats', 'stats')
            ->middleware('can:portefeuilles.view')
            ->name('stats');
    });

Route::controller(VersementController::class)
    ->prefix('versements')
    ->name('versements.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:versements.view')
            ->name('index');

        Route::get('/stats', 'stats')
            ->middleware('can:versements.view')
            ->name('stats');

        Route::post('/', 'store')
            ->middleware('can:versements.create')
            ->name('store');

        Route::put('/{versement}', 'update')
            ->middleware('can:versements.edit')
            ->name('update');

        Route::delete('/{versement}', 'destroy')
            ->middleware('can:versements.delete')
            ->name('destroy');
    });

Route::controller(PaiementController::class)
    ->prefix('paiements')
    ->name('paiements.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:paiements.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:paiements.create')
            ->name('store');

        Route::put('/{paiement}', 'update')
            ->middleware('can:paiements.edit')
            ->name('update');

        Route::delete('/{paiement}', 'destroy')
            ->middleware('can:paiements.delete')
            ->name('destroy');
    });
