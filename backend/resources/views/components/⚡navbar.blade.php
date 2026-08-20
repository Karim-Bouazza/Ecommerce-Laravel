<?php

use Livewire\Component;
use App\Models\Category;

new class extends Component {
    public function with(): array
    {
        return [
            'categories' => Category::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ];
    }
};
?>

<div class="sticky top-0 z-50 border-b border-zinc-100 bg-white">
    <div class="border-b border-zinc-100 bg-zinc-50 py-2 text-center text-sm font-bold text-zinc-800 sm:hidden" dir="rtl">
        حماية أفضل تبدأ بمعدات موثوقة
    </div>

    <flux:container class="flex items-center gap-6 py-3 sm:py-4 px-2!">
        {{-- Mobile: menu trigger + centered brand --}}
        <div class="flex w-full items-center gap-2 sm:hidden">
            <flux:modal.trigger name="mobile-menu">
                <flux:button variant="ghost" size="sm" square aria-label="{{ __('Open menu') }}">
                    <flux:icon.bars-3 class="size-6" />
                </flux:button>
            </flux:modal.trigger>

            <div class="flex flex-1 justify-center">
                <flux:brand href="{{ url('/') }}" name="ProSecurity DZ" class="me-0! [&>div:last-child]:text-[18px]! font-bold text-zinc-900" />
            </div>

            <div class="size-9 shrink-0" aria-hidden="true"></div>
        </div>

        <flux:modal name="mobile-menu" variant="flyout" position="left" class="w-64">
            <div class="flex flex-col gap-4">
                <flux:brand href="{{ url('/') }}" name="ProSecurity DZ" class="text-lg font-bold text-zinc-900" />

                <flux:navlist>
                    <flux:navlist.item href="{{ url('/') }}">
                        Accueil
                    </flux:navlist.item>

                    @foreach ($categories as $category)
                        <flux:navlist.item href="#">
                            {{ $category->name }}
                        </flux:navlist.item>
                    @endforeach
                </flux:navlist>
            </div>
        </flux:modal>

        {{-- Desktop: brand + nav links + login --}}
        <div class="hidden w-full items-center gap-6 sm:flex">
            <flux:brand href="{{ url('/') }}" name="ProSecurity DZ" class="text-lg font-bold text-zinc-900" />

            <flux:navbar>
                <flux:navbar.item href="{{ url('/') }}">
                    Accueil
                </flux:navbar.item>

                @foreach ($categories as $category)
                    <flux:navbar.item href="#">
                        {{ $category->name }}
                    </flux:navbar.item>
                @endforeach
            </flux:navbar>

            <flux:spacer />

            <flux:button href="#" variant="primary" class="shrink-0 rounded-full">
                Login
            </flux:button>
        </div>
    </flux:container>
</div>
