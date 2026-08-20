<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        @vite(['resources/css/app.css', 'resources/js/app.js'])

        @livewireStyles
        @fluxAppearance
    </head>
    <body class="bg-zinc-50 text-zinc-900 flex min-h-screen flex-col">
        <livewire:navbar />

        <x-hero-banner />

        <x-new-arrivals />

        <x-promo-products />

        <x-custom-epi />

        <x-footer />

        @livewireScripts
        @fluxScripts
    </body>
</html>
