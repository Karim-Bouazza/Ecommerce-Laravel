<?php

namespace App\Data\Inventory;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateWarehouseData extends Data
{
    public function __construct(
        public string|Optional $name = new Optional(),
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'remark' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string'],
            'all_wilayas' => ['sometimes', 'boolean'],
            'all_products' => ['sometimes', 'boolean'],
            'wilaya_ids' => ['sometimes', 'array'],
            'wilaya_ids.*' => ['integer', 'exists:wilayas,id'],
            'product_ids' => ['sometimes', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ];
    }
}
