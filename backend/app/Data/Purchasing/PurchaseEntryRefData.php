<?php

namespace App\Data\Purchasing;

use App\Models\Purchasing\PurchaseEntry;
use Spatie\LaravelData\Data;

class PurchaseEntryRefData extends Data
{
    public function __construct(
        public int $id,
        public string $reference,
    ) {}

    public static function fromEntry(PurchaseEntry $entry): self
    {
        return new self($entry->id, $entry->reference);
    }
}
