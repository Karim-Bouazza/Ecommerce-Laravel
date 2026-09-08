<?php

namespace App\Services\Roles;

use App\Models\Role;
use App\Support\PermissionRegistry;
use RuntimeException;

class UpdateRoleService
{
    public function execute(Role $role, array $data): Role
    {
        if ($role->is_system) {
            throw new RuntimeException('Le rôle système ne peut pas être modifié.');
        }

        $permissions = array_values(array_intersect($data['permissions'] ?? [], PermissionRegistry::all()));

        $role->update([
            'name' => $data['name'],
            'permissions' => $permissions,
        ]);

        return $role;
    }
}
