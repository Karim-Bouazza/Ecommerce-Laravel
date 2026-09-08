<?php

namespace App\Services\Administrateurs;

use App\Models\User;

class DeleteAdministrateurService
{
    public function execute(User $user): void
    {
        $user->delete();
    }
}
