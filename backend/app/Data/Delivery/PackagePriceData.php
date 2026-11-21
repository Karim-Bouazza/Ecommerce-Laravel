<?php

namespace App\Data\Delivery;

use Spatie\LaravelData\Data;

class PackagePriceData extends Data
{
    public function __construct(
        public mixed $insurance_value,
        public mixed $extra_weight_price,
        public mixed $delivery_price,
        public mixed $total_price,
        public mixed $price_to_pay,
    ) {}

    public static function fromResult(array $result): self
    {
        return new self(
            insurance_value: $result['insurance_value'],
            extra_weight_price: $result['extra_weight_price'],
            delivery_price: $result['delivery_price'],
            total_price: $result['total_price'],
            price_to_pay: $result['price_to_pay'],
        );
    }
}
