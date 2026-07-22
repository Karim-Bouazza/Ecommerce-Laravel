<?php


use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\WilayaController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\ProductController;

Route::prefix('v1')->group(function () {

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/wilayas', [WilayaController::class, 'index']);
    Route::get('/wilayas/{wilaya}', [WilayaController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
});
