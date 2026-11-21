<?php

namespace App\Data\Purchasing;

use App\Data\Inventory\WarehouseRefData;
use App\Models\Purchasing\PurchaseEntry;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class PurchaseEntryData extends Data
{
    public function __construct(
        public int $id,
        public string $reference,
        public WarehouseRefData|Optional $warehouse,
        public FournisseurRefData|Optional $fournisseur,
        public ?string $remark,
        public array|Optional $items,
        public mixed $total,
        public string $status,
        public string $status_label,
        public string $status_color,
        public string $payment_status,
        public string $payment_status_label,
        public string $payment_status_color,
        public mixed $paid_amount,
        public mixed $remaining_amount,
        public ?CarbonInterface $created_at,
    ) {}

    public static function fromEntry(PurchaseEntry $entry): self
    {
        $paymentStatus = $entry->paymentStatus();

        return new self(
            id: $entry->id,
            reference: $entry->reference,
            warehouse: $entry->relationLoaded('warehouse')
                ? WarehouseRefData::fromWarehouse($entry->warehouse)
                : new Optional(),
            fournisseur: $entry->relationLoaded('fournisseur')
                ? FournisseurRefData::fromFournisseur($entry->fournisseur)
                : new Optional(),
            remark: $entry->remark,
            items: $entry->relationLoaded('items')
                ? $entry->items->map(fn ($item) => EntryItemData::fromPurchaseItem($item))->all()
                : new Optional(),
            total: $entry->total,
            status: $entry->status->value,
            status_label: $entry->status->label(),
            status_color: $entry->status->color(),
            payment_status: $paymentStatus->value,
            payment_status_label: $paymentStatus->label(),
            payment_status_color: $paymentStatus->color(),
            paid_amount: $entry->paidAmount(),
            remaining_amount: $entry->remainingAmount(),
            created_at: $entry->created_at,
        );
    }
}
