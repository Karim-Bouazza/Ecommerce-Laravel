<?php

namespace App\Data\Storefront;

use Spatie\LaravelData\Data;

class ReorderStorefrontItemsData extends Data
{
    public function __construct(
        public array $ids,
    ) {}

    public static function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct'],
        ];
    }

    public function orderedIds(): array
    {
        return array_map('intval', $this->ids);
    }
}
