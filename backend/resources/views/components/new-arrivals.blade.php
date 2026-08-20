@php
    $newArrivals = \App\Models\Product::with('category')
        ->where('is_active', true)
        ->latest()
        ->take(10)
        ->get();
@endphp

@if ($newArrivals->isNotEmpty())
    <flux:container
        class="py-12"
        x-data="{
            active: 0,
            total: {{ $newArrivals->count() }},
            spacing: 68,
            setSpacing() {
                this.spacing = window.matchMedia('(min-width: 640px)').matches ? 180 : 68
            },
            init() {
                this.setSpacing()
                window.addEventListener('resize', () => this.setSpacing())
                setInterval(() => { this.active = (this.active + 1) % this.total }, 5000)
            },
            cardStyle(i) {
                let offset = i - this.active
                offset = ((offset % this.total) + this.total) % this.total
                if (offset > this.total / 2) offset -= this.total

                const abs = Math.abs(offset)
                const rotate = offset * 7
                const tx = offset * this.spacing
                const ty = abs * 20
                const scale = Math.max(1 - abs * 0.09, 0.55)
                const opacity = abs <= 3 ? 1 - abs * 0.07 : 0
                const pe = abs === 0 ? 'auto' : 'none'

                return `transform: translate(calc(-50% + ${tx}px), ${ty}px) rotate(${rotate}deg) scale(${scale}); opacity: ${opacity}; z-index: ${50 - abs}; pointer-events: ${pe};`
            },
        }"
    >
        <flux:heading size="xl" level="2" class="mb-10 text-center">
            Dernières Nouveautés
        </flux:heading>

        <div class="relative isolate mx-auto h-96 w-full overflow-hidden sm:h-128">
            @foreach ($newArrivals as $i => $product)
                <div
                    class="absolute top-0 left-1/2 w-52 rounded-xl border border-gray-400 transition-all duration-700 ease-out sm:w-72"
                    :style="cardStyle({{ $i }})"
                >
                    <x-product-card :product="$product" />
                </div>
            @endforeach
        </div>

        <div class="mt-8 text-center">
            <a href="{{ route('products.index') }}" class="font-semibold text-[#f6c530] underline underline-offset-4 hover:text-[#f6c530]/80">
                Tout Voir
            </a>
        </div>
    </flux:container>
@endif
