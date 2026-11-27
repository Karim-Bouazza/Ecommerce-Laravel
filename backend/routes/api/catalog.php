<?php

use App\Http\Controllers\Api\Catalog\CategoryController;
use App\Http\Controllers\Api\Catalog\ProductController;
use App\Http\Controllers\Api\Delivery\WilayaController;
use Illuminate\Support\Facades\Route;

Route::controller(ProductController::class)
    ->prefix('products')
    ->name('products.')
    ->group(function () {
        Route::get('/', 'index')->name('index');

        Route::post('/', 'store')
            ->middleware('can:products.create')
            ->name('store');

        Route::put('/{product}', 'update')
            ->middleware('can:products.edit')
            ->name('update');

        Route::delete('/{product}', 'destroy')
            ->middleware('can:products.delete')
            ->name('destroy');
    });

Route::controller(CategoryController::class)
    ->prefix('categories')
    ->name('categories.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:categories.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:categories.create')
            ->name('store');

        Route::patch('/{category}', 'update')
            ->middleware('can:categories.edit')
            ->name('update');

        Route::delete('/{category}', 'destroy')
            ->middleware('can:categories.delete')
            ->name('destroy');

        Route::post('/{category}/toggle-active', 'toggleActive')
            ->middleware('can:categories.edit')
            ->name('toggle-active');

        Route::get('/options', 'options')->name('options');
    });

Route::put('/wilayas/{wilaya}', [WilayaController::class, 'update'])
    ->middleware('can:wilayas.edit')
    ->name('wilayas.update');
