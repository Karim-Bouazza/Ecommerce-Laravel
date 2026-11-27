<?php

namespace App\Data\Inventory;

use Spatie\LaravelData\Data;

class AdjustStockData extends Data
{
    public function __construct(
        public int $warehouse_id,
        public int $adjustment,
    ) {}

    public static function rules(): array
    {
        return [
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'adjustment' => ['required', 'integer'],
        ];
    }
}
