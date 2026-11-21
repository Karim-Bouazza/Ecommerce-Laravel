<?php

namespace App\Data\Delivery;

use App\Models\Delivery\Wilaya;
use Spatie\LaravelData\Data;

class WilayaData extends Data
{
    public function __construct(
        public int $id,
        public mixed $code,
        public string $name,
        public ?string $ar_name,
        public mixed $price_domicile,
        public mixed $price_stop_desk,
    ) {}

    public static function fromWilaya(Wilaya $wilaya): self
    {
        return new self(
            id: $wilaya->id,
            code: $wilaya->code,
            name: $wilaya->name,
            ar_name: $wilaya->ar_name,
            price_domicile: $wilaya->price_domicile,
            price_stop_desk: $wilaya->price_stop_desk,
        );
    }
}
