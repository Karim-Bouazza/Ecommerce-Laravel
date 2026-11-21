<?php

namespace App\States\Transfer;

class Pending extends TransferState
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
