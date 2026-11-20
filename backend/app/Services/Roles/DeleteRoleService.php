<?php

namespace App\Services\Roles;

use App\Support\PermissionRegistry;
use RuntimeException;
use Spatie\Permission\Models\Role;

class DeleteRoleService
{
    public function execute(Role $role): void
    {
        if (PermissionRegistry::isSystemRole($role->name)) {
            throw new RuntimeException('Le rôle système ne peut pas être supprimé.');
        }

        if ($role->users()->exists()) {
            throw new RuntimeException('Des administrateurs utilisent ce rôle.');
        }

        $role->delete();
    }
}
