<?php

use App\Http\Controllers\Api\Purchasing\FournisseurController;
use App\Http\Controllers\Api\Purchasing\PurchaseEntryController;
use App\Http\Controllers\Api\Purchasing\ReturnEntryController;
use Illuminate\Support\Facades\Route;

Route::controller(FournisseurController::class)
    ->prefix('fournisseurs')
    ->name('fournisseurs.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:fournisseurs.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:fournisseurs.create')
            ->name('store');

        Route::patch('/{fournisseur}', 'update')
            ->middleware('can:fournisseurs.edit')
            ->name('update');

        Route::delete('/{fournisseur}', 'destroy')
            ->middleware('can:fournisseurs.delete')
            ->name('destroy');
    });

Route::controller(PurchaseEntryController::class)
    ->prefix('purchase-entries')
    ->name('purchase-entries.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:entrees_achat.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:entrees_achat.create')
            ->name('store');

        Route::put('/{purchaseEntry}', 'update')
            ->middleware('can:entrees_achat.edit')
            ->name('update');

        Route::post('/{purchaseEntry}/confirm', 'confirm')
            ->middleware('can:entrees_achat.edit')
            ->name('confirm');

        Route::delete('/{purchaseEntry}', 'destroy')
            ->middleware('can:entrees_achat.delete')
            ->name('destroy');

        Route::get('/{purchaseEntry}/versements', 'versements')
            ->middleware('can:versements.view')
            ->name('versements.index');

        Route::post('/{purchaseEntry}/versements', 'createVersement')
            ->middleware('can:versements.create')
            ->name('versements.store');
    });

Route::controller(ReturnEntryController::class)
    ->prefix('return-entries')
    ->name('return-entries.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:entrees_retour.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:entrees_retour.create')
            ->name('store');

        Route::put('/{returnEntry}', 'update')
            ->middleware('can:entrees_retour.edit')
            ->name('update');

        Route::post('/{returnEntry}/confirm', 'confirm')
            ->middleware('can:entrees_retour.edit')
            ->name('confirm');

        Route::delete('/{returnEntry}', 'destroy')
            ->middleware('can:entrees_retour.delete')
            ->name('destroy');

        Route::get('/{returnEntry}/versements', 'versements')
            ->middleware('can:versements.view')
            ->name('versements.index');

        Route::post('/{returnEntry}/versements', 'createVersement')
            ->middleware('can:versements.create')
            ->name('versements.store');

        Route::get('/purchase-entry-options', 'purchaseEntryOptions')
            ->middleware('can:entrees_retour.view')
            ->name('purchase-entry-options');

        Route::get('/purchase-entries/{purchaseEntry}/items', 'purchaseEntryItems')
            ->middleware('can:entrees_retour.view')
            ->name('purchase-entry-items');
    });
