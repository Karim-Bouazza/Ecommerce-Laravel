@props(['images', 'alt' => '', 'bleed' => false])

<div
    x-data="{ active: 0, images: @js($images) }"
    class="flex flex-col gap-4"
>
    @if ($bleed)
        <div class="w-full overflow-hidden bg-white">
            <template x-if="images.length">
                <img
                    :src="images[active]"
                    alt="{{ $alt }}"
                    class="h-auto w-full"
                >
            </template>
        </div>
    @else
        <flux:card class="mx-auto aspect-square w-full max-w-md overflow-hidden p-0">
            <template x-if="images.length">
                <img
                    :src="images[active]"
                    alt="{{ $alt }}"
                    class="h-full w-full object-contain p-6"
                >
            </template>
        </flux:card>
    @endif

    <div x-show="images.length > 1" class="flex gap-3 {{ $bleed ? 'px-6' : '' }}">
        <template x-for="(image, index) in images" :key="index">
            <flux:card
                class="aspect-square w-20 shrink-0 cursor-pointer overflow-hidden p-0 transition"
                x-bind:class="active === index ? 'ring-2 ring-accent' : 'hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600'"
                @click="active = index"
            >
                <img :src="image" alt="" class="h-full w-full object-contain">
            </flux:card>
        </template>
    </div>
</div>
