<?php

use App\Http\Controllers\Api\Settings\SiteSettingLanguageController;
use App\Http\Controllers\Api\Storefront\StorefrontFeatureController;
use App\Http\Controllers\Api\Storefront\StorefrontHeroCategoryController;
use App\Http\Controllers\Api\Storefront\StorefrontPromoBannerController;
use App\Http\Controllers\Api\Storefront\StorefrontSectionProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('site-settings')
    ->name('site-settings.')
    ->group(function () {
        Route::put('/language', [SiteSettingLanguageController::class, 'update'])->name('language.update');

        Route::controller(StorefrontHeroCategoryController::class)
            ->prefix('hero-categories')
            ->name('hero-categories.')
            ->group(function () {
                Route::post('/', 'store')->name('store');
                Route::put('/{heroCategory}', 'update')->name('update');
                Route::delete('/{heroCategory}', 'destroy')->name('destroy');
            });

        Route::controller(StorefrontSectionProductController::class)
            ->prefix('sections/{section}/products')
            ->name('sections.products.')
            ->group(function () {
                Route::get('/', 'manage')->name('manage');
                Route::post('/', 'store')->name('store');
                Route::put('/order', 'reorder')->name('reorder');
                Route::put('/{item}', 'update')->name('update');
                Route::delete('/{item}', 'destroy')->name('destroy');
            });

        Route::controller(StorefrontFeatureController::class)
            ->prefix('features')
            ->name('features.')
            ->group(function () {
                Route::post('/', 'store')->name('store');
                Route::put('/order', 'reorder')->name('reorder');
                Route::put('/{feature}', 'update')->name('update');
                Route::delete('/{feature}', 'destroy')->name('destroy');
            });

        Route::controller(StorefrontPromoBannerController::class)
            ->prefix('promo-banners')
            ->name('promo-banners.')
            ->group(function () {
                Route::post('/', 'store')->name('store');
                Route::put('/order', 'reorder')->name('reorder');
                Route::put('/{banner}', 'update')->name('update');
                Route::delete('/{banner}', 'destroy')->name('destroy');
            });
    });
