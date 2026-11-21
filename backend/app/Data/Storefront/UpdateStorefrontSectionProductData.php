<?php

namespace App\Data\Storefront;

use Spatie\LaravelData\Data;

class UpdateStorefrontSectionProductData extends Data
{
    public function __construct(
        public ?string $label = null,
    ) {}

    public static function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:60'],
        ];
    }
}
