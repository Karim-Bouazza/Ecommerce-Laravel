<?php

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;

new class extends Component
{
    use WithPagination;

    public function with(): array {
        return [
            'products' => Product::paginate(20),
        ];
    }
};
?>

<div>
    @foreach($products as $product)
        <div>
            <h2>{{ $product->name }}</h2>
            <p>{{ $product->price }} DA</p>
        </div>
    @endforeach

        {{ $products->links() }}
</div>
