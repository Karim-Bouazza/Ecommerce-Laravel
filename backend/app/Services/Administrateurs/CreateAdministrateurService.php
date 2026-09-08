<?php

namespace App\Services\Administrateurs;

use App\Models\User;

class CreateAdministrateurService
{
    public function execute(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'role_id' => $data['role_id'],
            'password' => $data['password'],
            'is_active' => $data['is_active'] ?? true,
        ]);
    }
}
