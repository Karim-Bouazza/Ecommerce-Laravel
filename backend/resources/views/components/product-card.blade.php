@props(['product', 'promoBadge' => false])

@php
    $hasDiscount = $product->compare_price > $product->price;
    $discountPercent = $hasDiscount
        ? (int) round((($product->compare_price - $product->price) / $product->compare_price) * 100)
        : null;
    $formatPrice = fn ($amount) => number_format($amount, 0, '.', ' ');
@endphp

<a
    href="{{ route('products.show', $product->id) }}"
    class="group block h-full"
>
    <flux:card class="flex h-full flex-col gap-2 p-2 transition group-hover:shadow-lg sm:gap-3 sm:p-3">

        {{-- Product Image --}}
        <div class="relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
            @if ($promoBadge && $hasDiscount)
                <span class="absolute top-1.5 left-1.5 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white sm:top-2 sm:left-2 sm:px-3 sm:py-1 sm:text-xs">
                    Promo!
                </span>
            @endif

            <img
                src="{{ Storage::url($product->image_1) }}"
                alt="{{ $product->name }}"
                class="aspect-square w-full object-contain transition duration-300 group-hover:scale-105"
            >
        </div>

        {{-- Product Information --}}
        <div class="flex flex-1 flex-col items-center gap-1 px-1 pb-1 text-center sm:items-start sm:text-left">

            <flux:heading class="truncate">
                {{ $product->name }}
            </flux:heading>

            @if ($product->category)
                <flux:text size="sm">
                    {{ $product->category->name }}
                </flux:text>
            @endif

            <flux:spacer />

            <div class="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
                <flux:text inline variant="strong" class="text-sm font-bold text-[#f6c530]! sm:text-base">
                    {{ number_format($product->price) }} DA
                </flux:text>

                @if ($hasDiscount)
                    <flux:text inline variant="subtle" class="text-xs line-through sm:text-base">
                        {{ number_format($product->compare_price) }} DA
                    </flux:text>

                    <flux:badge size="sm" rounded class="sm:ms-auto bg-accent/15! text-accent-content! dark:bg-accent/25! dark:text-accent!">
                        -{{ $discountPercent }}%
                    </flux:badge>
                @endif
            </div>

        </div>

    </flux:card>
</a>
