@props(['product'])

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
    <flux:card class="flex h-full flex-col gap-3 p-3 transition group-hover:shadow-lg">

        {{-- Product Image --}}
        <div class="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
            <img
                src="{{ Storage::url($product->image_1) }}"
                alt="{{ $product->name }}"
                class="aspect-square w-full object-contain transition duration-300 group-hover:scale-105"
            >
        </div>

        {{-- Product Information --}}
        <div class="flex flex-1 flex-col gap-1 px-1 pb-1">

            <flux:heading class="truncate">
                {{ $product->name }}
            </flux:heading>

            @if ($product->category)
                <flux:text size="sm">
                    {{ $product->category->name }}
                </flux:text>
            @endif

            <flux:spacer />

            <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <flux:text inline variant="strong" class="text-base font-bold">
                    {{ number_format($product->price) }} DA
                </flux:text>

                @if ($hasDiscount)
                    <flux:text inline variant="subtle" class="text-base line-through">
                        {{ number_format($product->compare_price) }} DA
                    </flux:text>

                    <flux:badge size="sm" rounded class="ms-auto bg-accent/15! text-accent-content! dark:bg-accent/25! dark:text-accent!">
                        -{{ $discountPercent }}%
                    </flux:badge>
                @endif
            </div>

        </div>

    </flux:card>
</a>
