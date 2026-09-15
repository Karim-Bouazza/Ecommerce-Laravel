<?php

namespace App\Http\Requests;

use App\Enums\PurchaseEntryStatus;
use App\Models\PurchaseEntry;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreReturnEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('entrees_retour.create');
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'purchase_entry_id' => ['required', 'integer', 'exists:purchase_entries,id', $this->purchaseEntryMustBeCompleted()],
            'remark' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.purchase_entry_item_id' => ['required', 'integer', 'exists:purchase_entry_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    protected function purchaseEntryMustBeCompleted(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) {
            $entry = PurchaseEntry::find($value);

            if ($entry && $entry->status !== PurchaseEntryStatus::Completed) {
                $fail("L'entrée d'achat sélectionnée doit être confirmée avant de pouvoir créer un retour.");
            }
        };
    }
}
