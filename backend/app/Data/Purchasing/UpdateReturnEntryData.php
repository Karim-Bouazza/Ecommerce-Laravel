<?php

namespace App\Data\Purchasing;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class UpdateReturnEntryData extends Data
{
    public function __construct(
        #[DataCollectionOf(ReturnEntryItemInputData::class)]
        public array $items,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.purchase_entry_item_id' => ['required', 'integer', 'exists:purchase_entry_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
