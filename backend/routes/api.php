<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::group([], base_path('routes/api/public.php'));

    Route::middleware('auth:sanctum')->group(function () {
        foreach ([
            'auth',
            'analytics',
            'catalog',
            'marketing',
            'fraud',
            'site-settings',
            'orders',
            'finance',
            'inventory',
            'purchasing',
            'delivery',
            'administration',
        ] as $file) {
            Route::group([], base_path("routes/api/{$file}.php"));
        }
    });
});
