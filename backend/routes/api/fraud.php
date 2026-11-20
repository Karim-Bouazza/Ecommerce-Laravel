<?php

use App\Http\Controllers\Api\Fraud\FraudController;
use Illuminate\Support\Facades\Route;

Route::controller(FraudController::class)
    ->prefix('fraud/assessments')
    ->name('fraud.assessments.')
    ->group(function () {
        Route::get('/', 'index')
            ->middleware('can:fraud.view')
            ->name('index');

        Route::get('/{order}', 'show')
            ->middleware('can:fraud.view')
            ->name('show');

        Route::post('/{order}/review', 'review')
            ->middleware('can:fraud.review')
            ->name('review');
    });
