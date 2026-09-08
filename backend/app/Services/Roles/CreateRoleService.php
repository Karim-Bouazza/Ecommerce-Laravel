<?php

namespace App\Services\Roles;

use App\Models\Role;
use App\Support\PermissionRegistry;

class CreateRoleService
{
    public function execute(array $data): Role
    {
        $permissions = array_values(array_intersect($data['permissions'] ?? [], PermissionRegistry::all()));

        return Role::create([
            'name' => $data['name'],
            'slug' => Role::generateUniqueSlug($data['name']),
            'permissions' => $permissions,
        ]);
    }
}
