<?php

use App\Http\Controllers\Api\Analytics\DashboardController;
use App\Http\Controllers\Api\Analytics\OrderAnalysisController;
use App\Http\Controllers\Api\Analytics\PerformanceController;
use App\Http\Controllers\Api\Analytics\ProductAnalyticsController;
use App\Http\Controllers\Api\Analytics\SalesChannelAnalysisController;
use App\Http\Controllers\Api\Analytics\WilayaAnalyticsController;
use Illuminate\Support\Facades\Route;

Route::controller(DashboardController::class)
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:tableau_de_bord.view')
            ->name('index');
    });

Route::controller(PerformanceController::class)
    ->prefix('performance')
    ->name('performance.')
    ->middleware('can:performance_kpi.view')
    ->group(function () {
        Route::get('/revenue', 'revenue')->name('revenue');
        Route::get('/sales-evolution', 'salesEvolution')->name('sales-evolution');
    });

Route::controller(OrderAnalysisController::class)
    ->prefix('order-analysis')
    ->name('order-analysis.')
    ->middleware('can:analytics_orders.view')
    ->group(function () {
        Route::get('/', 'overview')->name('overview');
        Route::get('/statuses', 'statuses')->name('statuses');
    });

Route::controller(SalesChannelAnalysisController::class)
    ->prefix('sales-channel-analysis')
    ->name('sales-channel-analysis.')
    ->middleware('can:analytics_sales_channels.view')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/chart', 'chart')->name('chart');
    });

Route::controller(ProductAnalyticsController::class)
    ->prefix('products/analytics')
    ->name('products.analytics.')
    ->middleware('can:products.view')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/stats', 'stats')->name('stats');
        Route::get('/chart', 'chart')->name('chart');
    });

Route::controller(WilayaAnalyticsController::class)
    ->prefix('wilayas/analytics')
    ->name('wilayas.analytics.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:wilayas.view')
            ->name('index');
    });
