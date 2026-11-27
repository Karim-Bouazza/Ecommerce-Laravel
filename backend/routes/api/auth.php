<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)
    ->name('auth.')
    ->group(function () {
        Route::post('/logout', 'logout')->name('logout');
        Route::post('/mobile/logout', 'tokenLogout')->name('token-logout');
        Route::get('/me', 'me')->name('me');
        Route::put('/me', 'updateProfile')->name('update-profile');
    });
