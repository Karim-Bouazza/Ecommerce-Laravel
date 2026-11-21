<?php

namespace App\Data\Delivery;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateWilayaPricesData extends Data
{
    public function __construct(
        public int|Optional $price_domicile = new Optional(),
        public int|Optional $price_stop_desk = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'price_domicile' => ['sometimes', 'integer', 'min:0'],
            'price_stop_desk' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
