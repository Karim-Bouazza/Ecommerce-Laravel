<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class SaveFournisseurData extends Data
{
    public function __construct(
        public string $name,
        public string|null|Optional $phone = new Optional(),
        public string|null|Optional $remark = new Optional(),
        public string|null|Optional $address = new Optional(),
    ) {}

    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'remark' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
        ];
    }
}
