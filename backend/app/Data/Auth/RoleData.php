<?php

namespace App\Data\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Support\Str;
use Spatie\LaravelData\Data;
use Spatie\Permission\Models\Role;

class RoleData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public bool $is_system,
        public array $permissions,
    ) {}

    public static function fromRole(Role $role): self
    {
        $isSystem = PermissionRegistry::isSystemRole($role->name);

        return new self(
            id: $role->id,
            name: $role->name,
            slug: Str::slug($role->name),
            is_system: $isSystem,
            permissions: $isSystem
                ? ['Tous']
                : $role->permissions
                    ->pluck('name')
                    ->map(fn (string $key) => PermissionRegistry::label($key))
                    ->values()
                    ->all(),
        );
    }
}
