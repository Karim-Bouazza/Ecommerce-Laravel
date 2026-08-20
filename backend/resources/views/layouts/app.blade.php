<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>{{ $title ?? config('app.name') }}</title>

        @vite(['resources/css/app.css', 'resources/js/app.js'])

        @livewireStyles
        @fluxAppearance
    </head>
    <body class="bg-zinc-50 text-zinc-900 flex min-h-screen flex-col">
        <livewire:navbar />

        {{ $slot }}

        <x-footer />

        @livewireScripts
        @fluxScripts
    </body>
</html>
