<?php

namespace App\Services\Roles;

use App\Support\PermissionRegistry;
use Spatie\Permission\Models\Role;

class CreateRoleService
{
    public function execute(array $data): Role
    {
        $permissions = array_values(array_intersect($data['permissions'] ?? [], PermissionRegistry::all()));

        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($permissions);

        return $role;
    }
}
