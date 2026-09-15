<?php

namespace App\Services\ReturnEntries;

use App\Models\ReturnEntry;
use RuntimeException;

class DeleteReturnEntryService
{
    public function execute(ReturnEntry $entry): void
    {
        if (! $entry->isPending()) {
            throw new RuntimeException('Seule une entrée en attente peut être supprimée.');
        }

        $entry->delete();
    }
}
