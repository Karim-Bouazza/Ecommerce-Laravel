@props([
    'href' => null,
    'alt' => 'Équipements de protection individuelle — ProSecurity DZ',
])

{{--
    Responsive hero banner.

    <picture> lets the browser pick a single file before it starts downloading:
    the desktop banner from the `sm` breakpoint (640px) up, the portrait banner
    below it. Using hidden/block utility classes instead would download both.
--}}
<a
    href="{{ $href ?? route('products.index') }}"
    {{ $attributes->merge(['class' => 'relative block w-full']) }}
>
    <picture>
        <source
            media="(min-width: 640px)"
            srcset="{{ asset('images/banner-pc.png') }}"
            width="1717"
            height="916"
        >

        <img
            src="{{ asset('images/banner-phone.png') }}"
            alt="{{ $alt }}"
            width="853"
            height="1844"
            fetchpriority="high"
            decoding="async"
            class="h-auto w-full"
        >
    </picture>

    <span class="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-lg transition hover:brightness-95 sm:bottom-6 sm:left-6 sm:translate-x-0 sm:px-6 sm:py-3 md:bottom-10 md:left-12 md:px-8 md:py-4 md:text-base">
        Découvrir Nos Produits
    </span>
</a>
