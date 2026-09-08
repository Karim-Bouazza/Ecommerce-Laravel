<?php

namespace App\Services\Administrateurs;

use App\Models\User;
use Illuminate\Support\Arr;

class UpdateAdministrateurService
{
    public function execute(User $user, array $data): User
    {
        $user->update(Arr::only($data, [
            'name',
            'email',
            'phone',
            'password',
            'is_active',
        ]));

        return $user;
    }
}
