<?php

namespace App\States\Return;

class Pending extends ReturnEntryState
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
