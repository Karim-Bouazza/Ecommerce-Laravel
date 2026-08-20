<?php

use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Url;
use App\Models\Product;
use App\Models\Category;

new class extends Component {
    use WithPagination;

    #[Url]
    public ?int $category_id = null;

    public function updatedCategoryId(): void
    {
        $this->resetPage();
    }

    public function with(): array
    {
        return [
            'products' => Product::with('category')
                ->where('is_active', true)
                ->when($this->category_id, fn ($query) => $query->where('category_id', $this->category_id))
                ->paginate(20),
            'categories' => Category::where('is_active', true)->orderBy('name')->get(),
        ];
    }
};
?>

<flux:container class="py-8">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <flux:heading size="xl" level="1">Nos produits</flux:heading>

        <flux:select wire:model.live="category_id" placeholder="Toutes les catégories" class="w-full sm:w-56">
            <option value="">Toutes les catégories</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}">{{ $category->name }}</option>
            @endforeach
        </flux:select>
    </div>

    @if ($products->isEmpty())
        <flux:text class="py-12 text-center" size="lg">
            Aucun produit
        </flux:text>
    @else
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            @foreach ($products as $product)

                <x-product-card :product="$product"/>

            @endforeach

        </div>

        <div class="mt-8">
            <flux:pagination :paginator="$products" />
        </div>
    @endif
</flux:container>
