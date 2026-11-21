<?php

namespace App\Services\Administrateurs;

use App\Data\Auth\StoreAdministratorData;
use App\Models\Users\User;
use Spatie\Permission\Models\Role;

class CreateAdministrateurService
{
    public function execute(StoreAdministratorData $input): User
    {
        $data = $input->toArray();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->syncRoles(Role::findById($data['role_id'], 'web'));

        return $user->load('roles.permissions');
    }
}
