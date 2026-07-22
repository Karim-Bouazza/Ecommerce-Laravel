@props(['product'])

<div>
<a
{{--    href="{{ route('products.show', $product->id) }}"--}}
    class="relative block overflow-hidden rounded-se-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
>

    {{-- Optional badge --}}
    <span
        class="absolute right-0 top-0 rounded-bl-2xl bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
    >
        New
    </span>

    {{-- Product Image --}}
    <img
        src="{{ Storage::url($product->image_1) }}"
        alt="{{ $product->name }}"
        class="h-72 w-full object-cover"
    >

    {{-- Product Information --}}
    <div class="p-5">

        <h2 class="text-lg font-bold text-gray-900">
            {{ $product->name }}
        </h2>

        <p class="mt-2 text-sm text-gray-600">
            {{ Str::limit($product->description, 80) }}
        </p>

        <p class="mt-4 text-2xl font-bold text-indigo-700">
            {{ number_format($product->price) }} DA
        </p>

        <button
            type="button"
            class="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-indigo-700"
        >
            View Product
        </button>

    </div>

</a>
</div>
