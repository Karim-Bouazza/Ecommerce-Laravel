<?php

use App\Http\Controllers\Api\Auth\AdministratorController;
use App\Http\Controllers\Api\Auth\RoleController;
use Illuminate\Support\Facades\Route;

Route::controller(AdministratorController::class)
    ->prefix('administrators')
    ->name('administrators.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:administrateurs.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:administrateurs.create')
            ->name('store');

        Route::get('/{administrator}', 'show')
            ->middleware('permission:administrateurs.view|administrateurs.edit')
            ->name('show');

        Route::post('/{administrator}/toggle-active', 'toggleActive')
            ->middleware('can:administrateurs.edit')
            ->name('toggle-active');

        Route::patch('/{administrator}', 'update')
            ->middleware('can:administrateurs.edit')
            ->name('update');


        Route::delete('/{administrator}', 'destroy')
            ->middleware('can:administrateurs.delete')
            ->name('destroy');
    });

Route::controller(RoleController::class)
    ->prefix('roles')
    ->name('roles.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:roles.view')
            ->name('index');

        Route::post('/', 'store')
            ->middleware('can:roles.create')
            ->name('store');

        Route::get('/permissions', 'permissions')
            ->middleware('permission:roles.create|roles.edit')
            ->name('permissions');

        Route::get('/role-options', 'roleOptions')
            ->middleware('permission:administrateurs.view|administrateurs.create|administrateurs.edit')
            ->name('role-options');

        Route::get('/{role}', 'show')
            ->middleware('can:roles.view')
            ->name('show');

        Route::patch('/{role}', 'update')
            ->middleware('can:roles.edit')
            ->name('update');

        Route::delete('/{role}', 'destroy')
            ->middleware('can:roles.delete')
            ->name('destroy');
    });
