<x-filament-panels::page>
    @php($warehouses = $this->getWarehouses())
    @php($stockQueryService = app(\App\Services\Warehouses\WarehouseStockQueryService::class))

    @if (count($warehouses))
        <x-filament::tabs>
            @foreach ($warehouses as $warehouse)
                @php($alertCount = $stockQueryService->lowStockCount($warehouse))

                <x-filament::tabs.item
                    :active="$this->warehouseId === $warehouse->id"
                    :badge="$alertCount > 0 ? $alertCount : null"
                    badge-color="danger"
                    wire:click="selectWarehouse({{ $warehouse->id }})"
                >
                    {{ $warehouse->name }}
                </x-filament::tabs.item>
            @endforeach
        </x-filament::tabs>
    @endif

    {{ $this->table }}
</x-filament-panels::page>
