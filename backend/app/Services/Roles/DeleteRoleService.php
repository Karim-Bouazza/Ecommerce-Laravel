<?php

namespace App\Services\Roles;

use App\Models\Role;
use RuntimeException;

class DeleteRoleService
{
    public function execute(Role $role): void
    {
        if ($role->is_system) {
            throw new RuntimeException('Le rôle système ne peut pas être supprimé.');
        }

        if ($role->users()->exists()) {
            throw new RuntimeException('Des administrateurs utilisent ce rôle.');
        }

        $role->delete();
    }
}
