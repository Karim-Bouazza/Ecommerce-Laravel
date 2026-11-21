<?php

namespace App\Services\Roles;

use App\Data\Auth\SaveRoleData;
use App\Support\PermissionRegistry;
use RuntimeException;
use Spatie\Permission\Models\Role;

class UpdateRoleService
{
    public function execute(Role $role, SaveRoleData $input): Role
    {
        $data = $input->toArray();

        if (PermissionRegistry::isSystemRole($role->name)) {
            throw new RuntimeException('Le rôle système ne peut pas être modifié.');
        }

        $permissions = array_values(array_intersect($data['permissions'] ?? [], PermissionRegistry::all()));

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($permissions);

        return $role;
    }
}
