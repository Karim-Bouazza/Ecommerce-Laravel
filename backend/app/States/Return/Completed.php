<?php

namespace App\States\Return;

class Completed extends ReturnEntryState
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
