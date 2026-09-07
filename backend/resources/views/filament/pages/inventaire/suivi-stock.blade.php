<x-filament-panels::page>
    @php($warehouses = $this->getWarehouses())

    @if (count($warehouses))
        <x-filament::tabs>
            @foreach ($warehouses as $warehouse)
                <x-filament::tabs.item
                    :active="$this->warehouseId === $warehouse->id"
                    wire:click="selectWarehouse({{ $warehouse->id }})"
                >
                    {{ $warehouse->name }}
                </x-filament::tabs.item>
            @endforeach
        </x-filament::tabs>
    @endif

    {{ $this->table }}
</x-filament-panels::page>
