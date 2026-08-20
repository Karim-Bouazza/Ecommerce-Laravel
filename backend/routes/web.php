<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::livewire('/products', 'pages::products')->name('products.index');
Route::livewire('/products/{product}', 'pages::products.show')->name('products.show');
