<?php

namespace App\Services\Roles;

use App\Data\Auth\UpdateRoleData;
use App\Support\PermissionRegistry;
use RuntimeException;
use Spatie\Permission\Models\Role;

class UpdateRoleService
{
    public function execute(Role $role, UpdateRoleData $input): Role
    {
        $data = $input->toArray();

        if (PermissionRegistry::isSystemRole($role->name)) {
            throw new RuntimeException('Le rôle système ne peut pas être modifié.');
        }

        if (array_key_exists('name', $data)) {
            $role->update(['name' => $data['name']]);
        }

        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions(array_values(array_intersect($data['permissions'], PermissionRegistry::all())));
        }

        return $role;
    }
}
