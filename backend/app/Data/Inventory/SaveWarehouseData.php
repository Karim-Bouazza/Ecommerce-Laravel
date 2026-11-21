<?php

namespace App\Data\Inventory;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SaveWarehouseData extends Data
{
    public function __construct(
        public string $name,
        public string|null|Optional $phone = new Optional(),
        public string|null|Optional $remark = new Optional(),
        public string|null|Optional $address = new Optional(),
        public bool|Optional $all_wilayas = new Optional(),
        public bool|Optional $all_products = new Optional(),
        public array|Optional $wilaya_ids = new Optional(),
        public array|Optional $product_ids = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'remark' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'all_wilayas' => ['boolean'],
            'all_products' => ['boolean'],
            'wilaya_ids' => ['array'],
            'wilaya_ids.*' => ['integer', 'exists:wilayas,id'],
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }
}
