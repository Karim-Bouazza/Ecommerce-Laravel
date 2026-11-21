<?php

namespace App\Data\Inventory;

use App\Models\Inventory\WarehouseTransfer;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class TransferData extends Data
{
    public function __construct(
        public int $id,
        public string $reference,
        public ?string $type,
        public WarehouseRefData|Optional $from_warehouse,
        public WarehouseRefData|Optional $to_warehouse,
        public ?string $remark,
        public array|Optional $items,
        public string $status,
        public string $status_label,
        public string $status_color,
        public string|null|Optional $creator_name,
        public ?CarbonInterface $confirmed_at,
        public ?CarbonInterface $created_at,
    ) {}

    public static function fromTransfer(WarehouseTransfer $transfer, ?int $viewingWarehouseId = null): self
    {
        return new self(
            id: $transfer->id,
            reference: $transfer->reference,
            type: $viewingWarehouseId
                ? ((int) $transfer->to_warehouse_id === $viewingWarehouseId ? 'in' : 'out')
                : null,
            from_warehouse: $transfer->relationLoaded('fromWarehouse')
                ? WarehouseRefData::fromWarehouse($transfer->fromWarehouse)
                : new Optional(),
            to_warehouse: $transfer->relationLoaded('toWarehouse')
                ? WarehouseRefData::fromWarehouse($transfer->toWarehouse)
                : new Optional(),
            remark: $transfer->remark,
            items: $transfer->relationLoaded('items')
                ? $transfer->items->map(fn ($item) => TransferItemData::fromItem($item))->all()
                : new Optional(),
            status: $transfer->status->value,
            status_label: $transfer->status->label(),
            status_color: $transfer->status->color(),
            creator_name: $transfer->relationLoaded('creator') ? $transfer->creator?->name : new Optional(),
            confirmed_at: $transfer->confirmed_at,
            created_at: $transfer->created_at,
        );
    }
}
