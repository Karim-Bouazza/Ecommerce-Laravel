<?php

namespace App\States\Purchase;

class Pending extends PurchaseEntryState
{
    public static $name = 'pending';

    public function label(): string
    {
        return 'En attente';
    }

    public function color(): string
    {
        return 'warning';
    }
}
