<?php

use Livewire\Component;
use App\Models\Product;
use App\Models\Wilaya;
use App\Models\Communes;
use App\Services\Orders\CreateOrderService;
use Illuminate\Support\Facades\Storage;

new class extends Component
{
    public Product $product;

    public string $first_name = '';

    public string $last_name = '';

    public string $phone_number = '';

    public ?int $wilaya_id = null;

    public ?int $commune_id = null;

    public ?int $priceDomicile = null;

    public ?int $priceStopDesk = null;

    public ?string $orderReference = null;

    public function mount(Product $product): void
    {
        abort_unless($product->is_active, 404);

        $this->product = $product->load('category');
    }

    public function updatedWilayaId(): void
    {
        $this->commune_id = null;

        $wilaya = $this->wilaya_id ? Wilaya::find($this->wilaya_id) : null;

        $this->priceDomicile = $wilaya?->price_domicile;
        $this->priceStopDesk = $wilaya?->price_stop_desk;
    }

    public function placeOrder(CreateOrderService $service, string $deliveryType, int $quantity = 1): void
    {
        $deliveryType = $deliveryType === 'stop_desk' ? 'stop_desk' : 'domicile';

        $validated = $this->validate([
            'first_name' => ['required', 'string', 'min:2'],
            'last_name' => ['required', 'string', 'min:2'],
            'phone_number' => ['required', 'regex:/^\d{2} \d{2} \d{2} \d{2} \d{2}$/'],
            'wilaya_id' => ['required', 'exists:wilayas,id'],
            'commune_id' => ['required', 'exists:communes,id'],
        ], [
            'phone_number.regex' => 'رقم الهاتف غير صحيح.',
        ], [
            'first_name' => 'الإسم',
            'last_name' => 'اللقب',
            'phone_number' => 'الهاتف',
            'wilaya_id' => 'الولاية',
            'commune_id' => 'البلدية',
        ]);

        $quantity = max(1, $quantity);

        $wilaya = Wilaya::findOrFail($validated['wilaya_id']);

        $order = $service->execute([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'phone_number' => str_replace(' ', '', $validated['phone_number']),
            'wilaya_id' => $wilaya->id,
            'commune_id' => $validated['commune_id'],
            'delivery_price' => $deliveryType === 'stop_desk' ? $wilaya->price_stop_desk : $wilaya->price_domicile,
            'items' => [
                ['product_id' => $this->product->id, 'quantity' => $quantity],
            ],
        ]);

        $this->reset(['first_name', 'last_name', 'phone_number', 'wilaya_id', 'commune_id', 'priceDomicile', 'priceStopDesk']);

        $this->orderReference = $order->reference;

        $this->modal('order-success')->show();
    }

    public function with(): array
    {
        $images = collect([
            $this->product->image_1,
            $this->product->image_2,
            $this->product->image_3,
            $this->product->image_4,
        ])
            ->filter()
            ->map(fn (string $path) => Storage::url($path))
            ->values();

        $wilayas = Wilaya::orderBy('name')->get();

        $selectedWilaya = $this->wilaya_id ? $wilayas->firstWhere('id', $this->wilaya_id) : null;

        $communes = $selectedWilaya
            ? Communes::where('wilaya_id', $selectedWilaya->id)->orderBy('name')->get()
            : collect();

        return [
            'images' => $images,
            'wilayas' => $wilayas,
            'selectedWilaya' => $selectedWilaya,
            'communes' => $communes,
        ];
    }
};
?>

<div>
    {{-- Mobile: full-width gallery flush under the navbar --}}
    <div class="lg:hidden">
        <x-product-gallery :images="$images" :alt="$product->name" bleed />
    </div>

    <flux:container class="px-4! py-8 lg:px-6">
    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">

        <div class="hidden lg:block">
            <x-product-gallery :images="$images" :alt="$product->name" />
        </div>

        <div class="flex flex-col gap-4">
            <flux:heading size="xl" level="1">{{ $product->name }}</flux:heading>

            <div class="flex items-center gap-3">
                <flux:text inline variant="strong" class="text-2xl font-bold">
                    {{ number_format($product->price) }} DA
                </flux:text>

                @if ($product->compare_price > $product->price)
                    <flux:text inline variant="subtle" class="text-lg line-through">
                        {{ number_format($product->compare_price) }} DA
                    </flux:text>
                @endif
            </div>

            <div dir="rtl" class="mt-4">
                <flux:card class="flex flex-col gap-5 border border-gray-600 px-3 py-6 dark:border-white/10">

                    <div class="rounded-lg border border-zinc-200 p-4 text-center dark:border-white/10">
                        <flux:heading size="xl">استمارة الطلب</flux:heading>
                        <flux:text variant="subtle" class="mt-1">
                            المرجو إدخال معلوماتك الخاصة بك
                        </flux:text>
                    </div>

                    <form
                        @submit.prevent="$wire.placeOrder(deliveryType, quantity).then(() => quantity = 1)"
                        class="flex flex-col gap-4"
                        x-data="{
                            quantity: 1,
                            unitPrice: @js($product->price),
                            deliveryType: 'domicile',
                            priceDomicile: $wire.entangle('priceDomicile'),
                            priceStopDesk: $wire.entangle('priceStopDesk'),
                            get deliveryPrice() {
                                return this.deliveryType === 'stop_desk' ? this.priceStopDesk : this.priceDomicile;
                            },
                            formatPrice(value) {
                                return 'DZD ' + Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            },
                        }"
                        x-init="$watch('priceDomicile', () => deliveryType = 'domicile')"
                    >

                            <div class="flex flex-col gap-4">
                                <flux:field>
                                    <flux:label class="text-[#1c5493]">الإسم<span class="text-red-500">*</span></flux:label>
                                    <flux:input.group>
                                        <flux:input.group.prefix>
                                            <flux:icon.user class="size-5 text-zinc-500 dark:text-zinc-400" />
                                        </flux:input.group.prefix>
                                        <flux:input
                                            wire:model="first_name"
                                            placeholder="الإسم"
                                            dir="rtl"
                                        />
                                    </flux:input.group>
                                </flux:field>

                                <flux:field>
                                    <flux:label class="text-[#1c5493]">اللقب<span class="text-red-500">*</span></flux:label>
                                    <flux:input.group>
                                        <flux:input.group.prefix>
                                            <flux:icon.user class="size-5 text-zinc-500 dark:text-zinc-400" />
                                        </flux:input.group.prefix>
                                        <flux:input
                                            wire:model="last_name"
                                            placeholder="اللقب"
                                            dir="rtl"
                                        />
                                    </flux:input.group>
                                </flux:field>
                            </div>

                            <flux:field>
                                <flux:label class="text-[#1c5493]">الهاتف<span class="text-red-500">*</span></flux:label>
                                <flux:input.group dir="ltr">
                                    <flux:input
                                        wire:model="phone_number"
                                        type="tel"
                                        placeholder="رقم الهاتف"
                                        class:input="text-right"
                                        mask="99 99 99 99 99"
                                    />
                                    <flux:input.group.suffix>
                                        <flux:icon.phone class="size-5 text-zinc-500 dark:text-zinc-400" />
                                    </flux:input.group.suffix>
                                </flux:input.group>
                            </flux:field>

                            <flux:field>
                                <flux:label class="text-[#1c5493]">الولاية<span class="text-red-500">*</span></flux:label>
                                <flux:input.group>
                                    <flux:input.group.prefix>
                                        <flux:icon.flag class="size-5 text-zinc-500 dark:text-zinc-400" />
                                    </flux:input.group.prefix>
                                    <flux:select wire:model.live="wilaya_id" placeholder="الولاية" dir="rtl">
                                        <option value="">اختر الولاية</option>
                                        @foreach ($wilayas as $wilaya)
                                            <option value="{{ $wilaya->id }}">{{ $wilaya->name }}</option>
                                        @endforeach
                                    </flux:select>
                                </flux:input.group>
                            </flux:field>

                            @if ($selectedWilaya)
                                <flux:card class="flex flex-col gap-3 p-4">
                                    <flux:text class="flex items-center gap-2" variant="strong">
                                        <flux:icon.truck variant="micro" />
                                        خيارات التوصيل
                                    </flux:text>

                                    <flux:separator />

                                    <div dir="ltr" class="flex flex-col gap-2">
                                        <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 has-checked:border-accent has-checked:bg-accent/5 dark:border-white/10">
                                            <span class="flex items-center gap-2">
                                                <input type="radio" x-model="deliveryType" value="domicile" class="accent-accent size-4">
                                                <span dir="rtl">التوصيل للمنزل</span>
                                            </span>
                                            <span class="font-medium">{{ number_format($selectedWilaya->price_domicile, 2) }} DZD</span>
                                        </label>

                                        <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 has-checked:border-accent has-checked:bg-accent/5 dark:border-white/10">
                                            <span class="flex items-center gap-2">
                                                <input type="radio" x-model="deliveryType" value="stop_desk" class="accent-accent size-4">
                                                <span dir="rtl">التوصيل للمكتب</span>
                                            </span>
                                            <span class="font-medium">{{ number_format($selectedWilaya->price_stop_desk, 2) }} DZD</span>
                                        </label>
                                    </div>
                                </flux:card>
                            @endif

                            <flux:field>
                                <flux:label class="text-[#1c5493]">البلدية<span class="text-red-500">*</span></flux:label>
                                <flux:input.group>
                                    <flux:input.group.prefix>
                                        <flux:icon.building-office-2 class="size-5 text-zinc-500 dark:text-zinc-400" />
                                    </flux:input.group.prefix>
                                    <flux:select wire:model="commune_id" placeholder="البلدية" dir="rtl" :disabled="! $wilaya_id">
                                        <option value="">اختر البلدية</option>
                                        @foreach ($communes as $commune)
                                            <option value="{{ $commune->id }}">{{ $commune->name }}</option>
                                        @endforeach
                                    </flux:select>
                                </flux:input.group>
                            </flux:field>

                            <flux:field>
                                <flux:label class="text-[#1c5493]">الكمية<span class="text-red-500">*</span></flux:label>
                                <div class="flex items-center gap-2" dir="ltr">
                                    <flux:button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        icon="minus"
                                        @click="quantity = Math.max(1, quantity - 1)"
                                    />
                                    <flux:input
                                        type="number"
                                        min="1"
                                        x-model.number="quantity"
                                        class="w-16 text-center"
                                    />
                                    <flux:button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        icon="plus"
                                        @click="quantity++"
                                    />
                                </div>
                            </flux:field>

                            <div class="flex flex-col gap-2 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                                <div class="flex items-center justify-between">
                                    <flux:text class="flex items-center gap-2">
                                        <flux:icon.shopping-cart variant="micro" />
                                        سعر المنتج
                                    </flux:text>
                                    <flux:text variant="strong" x-text="formatPrice(quantity * unitPrice)"></flux:text>
                                </div>

                                <div class="flex items-center justify-between">
                                    <flux:text class="flex items-center gap-2">
                                        <flux:icon.truck variant="micro" />
                                        سعر التوصيل
                                    </flux:text>
                                    <flux:text variant="strong" x-text="deliveryPrice !== null ? formatPrice(deliveryPrice) : '--'"></flux:text>
                                </div>

                                <flux:separator />

                                <div class="flex items-center justify-between">
                                    <flux:text class="flex items-center gap-2">
                                        <flux:icon.calculator variant="micro" />
                                        المجموع
                                    </flux:text>
                                    <flux:text variant="strong" x-text="deliveryPrice !== null ? formatPrice((quantity * unitPrice) + deliveryPrice) : '--'"></flux:text>
                                </div>
                            </div>

                            <flux:button
                                type="submit"
                                variant="primary"
                                icon="shopping-bag"
                                class="cursor-pointer bg-linear-to-r! from-orange-500! to-red-500! text-white h-12! animate-shake-x"
                            >
                                إشتري الآن
                            </flux:button>
                    </form>

                </flux:card>
            </div>
        </div>

    </div>

    <flux:modal name="order-success" class="max-w-sm">
        <div dir="rtl" class="flex flex-col items-center gap-3 text-center">
            <flux:icon.check-circle class="size-12 text-green-500" />
            <flux:heading size="lg">تم استلام طلبك بنجاح</flux:heading>
            <flux:text variant="subtle">سنتصل بك قريبا لتأكيد الطلب.</flux:text>

            <flux:modal.close>
                <flux:button variant="primary" class="mt-2 w-full">حسنا</flux:button>
            </flux:modal.close>
        </div>
    </flux:modal>

    @if ($product->description)
        <flux:card class="prose prose-zinc mt-10 max-w-none p-6 dark:prose-invert">
            {!! $product->description !!}
        </flux:card>
    @endif
    </flux:container>
</div>
