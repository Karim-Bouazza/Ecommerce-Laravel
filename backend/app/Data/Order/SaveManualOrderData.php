<?php

namespace App\Data\Order;

use App\Enums\Order\DeliveryType;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class SaveManualOrderData extends Data
{
    public function __construct(
        public string $first_name,
        public string $last_name,
        public string $phone_number,
        public int $wilaya_id,
        #[DataCollectionOf(ManualOrderItemData::class)]
        public array $items,
        public ?int $commune_id = null,
        public ?string $address = null,
        public ?int $provider_wilaya_id = null,
        public ?int $provider_commune_id = null,
        public ?string $delivery_type = null,
        public ?int $stop_desk_company_id = null,
        public ?string $provider_office_id = null,
        public ?int $delivery_price = null,
        public ?string $delivery_note = null,
        public ?string $name = null,
        public ?string $provider_order_id = null,
        public ?bool $free_delivery = null,
        public ?bool $can_be_opened = null,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        $deliveryType = $context->payload['delivery_type'] ?? null;

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
                Rule::requiredIf($deliveryType === DeliveryType::PointRelais->value),
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
}
