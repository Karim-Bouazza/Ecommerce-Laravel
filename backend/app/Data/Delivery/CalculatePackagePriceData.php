<?php

namespace App\Data\Delivery;

use App\Enums\Order\DeliveryType;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class CalculatePackagePriceData extends Data
{
    public function __construct(
        public int $price,
        public int $provider_wilaya_id,
        public DeliveryType $delivery_type,
        public ?int $provider_commune_id = null,
        public ?string $provider_office_id = null,
        public bool $free_delivery = false,
        public bool $can_be_opened = false,
    ) {}

    public static function rules(ValidationContext $context): array
    {
        return [
            'price' => ['required', 'integer', 'min:0'],
            'provider_wilaya_id' => ['required', 'integer'],
            'provider_commune_id' => ['nullable', 'integer'],
            'delivery_type' => ['required', Rule::in(array_column(DeliveryType::cases(), 'value'))],
            'provider_office_id' => [
                'nullable',
                'string',
                Rule::requiredIf(($context->payload['delivery_type'] ?? null) === DeliveryType::PointRelais->value),
            ],
            'free_delivery' => ['nullable', 'boolean'],
            'can_be_opened' => ['nullable', 'boolean'],
        ];
    }
}
