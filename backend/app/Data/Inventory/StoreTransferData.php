<?php

namespace App\Data\Inventory;

use App\Models\Inventory\Stock;
use Illuminate\Contracts\Validation\Validator;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class StoreTransferData extends Data
{
    public function __construct(
        public int $from_warehouse_id,
        public int $to_warehouse_id,
        public ?string $remark,
        #[DataCollectionOf(TransferItemInputData::class)]
        public array $items,
    ) {}

    public static function rules(): array
    {
        return [
            'from_warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'to_warehouse_id' => ['required', 'integer', 'exists:warehouses,id', 'different:from_warehouse_id'],
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id', 'distinct'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public static function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $payload = $validator->getData();
            $fromWarehouseId = $payload['from_warehouse_id'] ?? null;
            $items = $payload['items'] ?? [];

            if (! $fromWarehouseId || ! is_array($items)) {
                return;
            }

            foreach ($items as $index => $item) {
                $productId = $item['product_id'] ?? null;
                $quantity = (int) ($item['quantity'] ?? 0);

                if (! $productId) {
                    continue;
                }

                $available = Stock::inDepot((int) $fromWarehouseId, (int) $productId);

                if ($quantity > $available) {
                    $validator->errors()->add(
                        "items.{$index}.quantity",
                        "La quantité dépasse le stock disponible ({$available})."
                    );
                }
            }
        });
    }
}
