<?php

namespace App\States\Purchase;

class Completed extends PurchaseEntryState
{
    public static $name = 'completed';

    public function label(): string
    {
        return 'Terminé';
    }

    public function color(): string
    {
        return 'success';
    }
}
