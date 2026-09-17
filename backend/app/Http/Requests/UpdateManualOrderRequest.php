<?php

namespace App\Http\Requests;

use App\Enums\DeliveryType;
use App\Models\Stock;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateManualOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('orders.edit');
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
            'commune_id' => ['nullable', 'integer', 'exists:communes,id'],
            'address' => ['nullable', 'string', 'max:1000'],
            'provider_wilaya_id' => ['nullable', 'integer'],
            'provider_commune_id' => ['nullable', 'integer'],

            'delivery_type' => ['nullable', Rule::in(array_column(DeliveryType::cases(), 'value'))],
            'stop_desk_company_id' => ['nullable', 'integer', 'exists:delivery_companies,id'],
            'provider_office_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::requiredIf(fn () => $this->input('delivery_type') === DeliveryType::PointRelais->value),
            ],
            'delivery_price' => ['nullable', 'integer', 'min:0'],
            'delivery_note' => ['nullable', 'string', 'max:1000'],
            'name' => ['nullable', 'string', 'max:255'],
            'provider_order_id' => ['nullable', 'string', 'max:255'],
            'free_delivery' => ['nullable', 'boolean'],
            'can_be_opened' => ['nullable', 'boolean'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['nullable', 'integer', 'exists:order_items,id'],
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
