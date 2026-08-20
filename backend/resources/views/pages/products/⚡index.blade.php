<?php

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;

new class extends Component {
    use WithPagination;

    public function with(): array
    {
        return [
            'products' => Product::with('category')->where('is_active', true)->paginate(20),
        ];
    }
};
?>

<flux:container class="py-8">
    <flux:heading size="xl" level="1" class="mb-6">Nos produits</flux:heading>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        @foreach ($products as $product)

            <x-product-card :product="$product"/>

        @endforeach

    </div>

    <div class="mt-8">
        <flux:pagination :paginator="$products" />
    </div>
</flux:container>
