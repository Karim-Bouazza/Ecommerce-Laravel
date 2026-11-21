<?php

namespace App\States\Transfer;

class Completed extends TransferState
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
