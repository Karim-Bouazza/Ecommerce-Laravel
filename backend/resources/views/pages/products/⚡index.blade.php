<?php

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;

new class extends Component {
    use WithPagination;

    public function with(): array
    {
        return [
            'products' => Product::paginate(20),
        ];
    }
};
?>

<div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        @foreach ($products as $product)

            <x-product-card :product="$product"/>

        @endforeach

    </div>

    <div class="mt-8">
        {{ $products->links() }}
    </div>
</div>
