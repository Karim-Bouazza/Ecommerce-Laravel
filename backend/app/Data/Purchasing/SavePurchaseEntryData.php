<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class SavePurchaseEntryData extends Data
{
    public function __construct(
        public int $warehouse_id,
        public int $fournisseur_id,
        #[DataCollectionOf(PurchaseEntryItemInputData::class)]
        public array $items,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'fournisseur_id' => ['required', 'integer', 'exists:fournisseurs,id'],
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.purchase_price' => ['required', 'integer', 'min:0'],
        ];
    }
}
