@php
    $promoProducts = \App\Models\Product::with('category')
        ->where('is_active', true)
        ->whereColumn('compare_price', '>', 'price')
        ->orderByRaw('(compare_price - price) / compare_price DESC')
        ->take(10)
        ->get();

    $maxDiscount = $promoProducts->max(
        fn ($product) => (int) round((($product->compare_price - $product->price) / $product->compare_price) * 100),
    );

    $promoSlides = $promoProducts->chunk(4);
@endphp

@if ($promoProducts->isNotEmpty())
    <flux:container class="px-3! py-12 sm:px-6!">
        <flux:heading size="xl" level="2" class="mb-8 text-center">
            PROMO jusqu'à {{ $maxDiscount }}% !
        </flux:heading>

        {{-- Mobile: swipeable carousel, 4 cards (2x2) per slide --}}
        <div
            class="lg:hidden"
            x-data="{ active: 0 }"
            x-init="$refs.promoScroller.addEventListener('scroll', () => {
                active = Math.round($refs.promoScroller.scrollLeft / $refs.promoScroller.clientWidth)
            })"
        >
            <div
                x-ref="promoScroller"
                class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                @foreach ($promoSlides as $slide)
                    <div class="grid w-full flex-none snap-center grid-cols-2 gap-2">
                        @foreach ($slide as $product)
                            <x-product-card :product="$product" promo-badge />
                        @endforeach
                    </div>
                @endforeach
            </div>

            @if ($promoSlides->count() > 1)
                <div class="mt-4 flex justify-center gap-2">
                    @foreach ($promoSlides as $slideIndex => $slide)
                        <button
                            type="button"
                            aria-label="Aller à la diapositive {{ $slideIndex + 1 }}"
                            @click="$refs.promoScroller.scrollTo({ left: {{ $slideIndex }} * $refs.promoScroller.clientWidth, behavior: 'smooth' })"
                            :class="active === {{ $slideIndex }} ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-300'"
                            class="h-2 rounded-full transition-all"
                        ></button>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Desktop: static grid --}}
        <div class="hidden lg:grid lg:grid-cols-4 lg:gap-6">
            @foreach ($promoProducts as $product)
                <x-product-card :product="$product" promo-badge />
            @endforeach
        </div>

        <div class="mt-8 text-center">
            <a href="{{ route('products.index') }}" class="font-semibold text-[#f6c530] underline underline-offset-4 hover:text-[#f6c530]/80">
                Tout Voir
            </a>
        </div>
    </flux:container>
@endif
