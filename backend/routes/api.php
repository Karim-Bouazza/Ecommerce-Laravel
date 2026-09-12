<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\WarehouseController;
use App\Http\Controllers\Api\WilayaController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/wilayas', [WilayaController::class, 'index']);
    Route::get('/wilayas/{wilaya}', [WilayaController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/clients', [ClientController::class, 'index']);
        Route::get('/clients/blacklist', [ClientController::class, 'blacklisted']);
        Route::put('/clients/{client}', [ClientController::class, 'update']);
        Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
        Route::post('/clients/{client}/toggle-blacklist', [ClientController::class, 'toggleBlacklist']);
        Route::get('/wallets', [WalletController::class, 'index']);
        Route::post('/wallets', [WalletController::class, 'store']);
        Route::put('/wallets/{wallet}', [WalletController::class, 'update']);
        Route::delete('/wallets/{wallet}', [WalletController::class, 'destroy']);
        Route::post('/wallets/{wallet}/deposit', [WalletController::class, 'deposit']);
        Route::post('/wallets/{wallet}/withdraw', [WalletController::class, 'withdraw']);
        Route::get('/wallets/{wallet}/transactions', [WalletController::class, 'transactions']);
        Route::post('/wallets/transfer', [WalletController::class, 'transfer']);
        Route::get('/wallets/stats', [WalletController::class, 'stats']);
        Route::get('/warehouses', [WarehouseController::class, 'index']);
        Route::post('/warehouses', [WarehouseController::class, 'store']);
        Route::put('/warehouses/{warehouse}', [WarehouseController::class, 'update']);
        Route::delete('/warehouses/{warehouse}', [WarehouseController::class, 'destroy']);
        Route::post('/warehouses/{warehouse}/toggle-active', [WarehouseController::class, 'toggleActive']);
    });
});
