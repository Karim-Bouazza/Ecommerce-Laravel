<?php

namespace App\Http\Requests;

use App\Models\Stock;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StoreTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('transferts.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $fromWarehouseId = $this->input('from_warehouse_id');
            $items = $this->input('items', []);

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
