<?php

namespace App\Services\Administrateurs;

use App\Models\Users\User;

class ToggleAdministrateurActiveService
{
    public function __construct(private readonly UpdateAdministrateurService $update) {}

    public function execute(User $user, ?User $actor = null): User
    {
        return $this->update->execute($user, ['is_active' => ! $user->is_active], $actor);
    }
}
