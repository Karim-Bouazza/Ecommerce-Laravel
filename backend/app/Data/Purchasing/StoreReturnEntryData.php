<?php

namespace App\Data\Purchasing;

use App\Enums\Purchase\PurchaseEntryStatus;
use App\Models\Purchasing\PurchaseEntry;
use Closure;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class StoreReturnEntryData extends Data
{
    public function __construct(
        public int $purchase_entry_id,
        #[DataCollectionOf(ReturnEntryItemInputData::class)]
        public array $items,
        public ?string $remark = null,
    ) {}

    public static function rules(): array
    {
        return [
            'purchase_entry_id' => ['required', 'integer', 'exists:purchase_entries,id', self::purchaseEntryMustBeCompleted()],
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.purchase_entry_item_id' => ['required', 'integer', 'exists:purchase_entry_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    private static function purchaseEntryMustBeCompleted(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) {
            $entry = PurchaseEntry::find($value);

            if ($entry && $entry->status !== PurchaseEntryStatus::Completed) {
                $fail("L'entrée d'achat sélectionnée doit être confirmée avant de pouvoir créer un retour.");
            }
        };
    }
}
