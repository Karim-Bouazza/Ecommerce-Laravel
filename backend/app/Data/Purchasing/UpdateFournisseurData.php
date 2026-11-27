<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UpdateFournisseurData extends Data
{
    public function __construct(
        public string|Optional $name = new Optional(),
        public string|null|Optional $phone = new Optional(),
        public string|null|Optional $remark = new Optional(),
        public string|null|Optional $address = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'remark' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
