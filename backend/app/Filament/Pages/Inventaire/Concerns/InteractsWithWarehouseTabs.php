<?php

namespace App\Filament\Pages\Inventaire\Concerns;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Builder;

trait InteractsWithWarehouseTabs
{
    public ?int $warehouseId = null;

    protected ?Warehouse $activeWarehouse = null;

    public function mount(): void
    {
        $this->warehouseId ??= $this->orderedWarehousesQuery()->value('id');
    }

    public function selectWarehouse(int $warehouseId): void
    {
        $this->warehouseId = $warehouseId;
        $this->activeWarehouse = null;
        $this->resetTable();
    }

    public function getActiveWarehouse(): ?Warehouse
    {
        if ($this->activeWarehouse?->id === $this->warehouseId) {
            return $this->activeWarehouse;
        }

        return $this->activeWarehouse = $this->warehouseId
            ? Warehouse::find($this->warehouseId)
            : null;
    }

    /**
     * @return array<int, Warehouse>
     */
    public function getWarehouses(): array
    {
        return $this->orderedWarehousesQuery()->get()->all();
    }

    /**
     * The "Default" warehouse (seeded once, see the seed_default_warehouse
     * migration) always leads the tab list, regardless of creation order.
     */
    protected function orderedWarehousesQuery(): Builder
    {
        return Warehouse::query()
            ->orderByRaw("(name = 'Default') desc")
            ->orderBy('id');
    }
}
