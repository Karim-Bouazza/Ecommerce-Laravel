<?php

namespace App\Http\Requests;

use App\Enums\DeliveryType;
use App\Models\Stock;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreManualOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('orders.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:255'],
            'wilaya_id' => ['required', 'integer', 'exists:wilayas,id'],
            'commune_id' => ['required', 'integer', 'exists:communes,id'],
            'address' => ['nullable', 'string', 'max:1000'],

            'delivery_type' => ['nullable', Rule::in(array_column(DeliveryType::cases(), 'value'))],
            'stop_desk_company_id' => [
                'nullable',
                'integer',
                'exists:delivery_companies,id',
                Rule::requiredIf(fn () => $this->input('delivery_type') === DeliveryType::StopDesk->value),
            ],
            'delivery_price' => ['nullable', 'integer', 'min:0'],
            'delivery_note' => ['nullable', 'string', 'max:1000'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variant' => ['nullable', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $items = $this->input('items', []);

            if (! is_array($items)) {
                return;
            }

            foreach ($items as $index => $item) {
                $warehouseId = $item['warehouse_id'] ?? null;
                $productId = $item['product_id'] ?? null;
                $quantity = (int) ($item['quantity'] ?? 0);

                if (! $warehouseId || ! $productId) {
                    continue;
                }

                $available = Stock::inDepot((int) $warehouseId, (int) $productId);

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
