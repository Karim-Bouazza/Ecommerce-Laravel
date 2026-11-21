<?php

namespace App\Data\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Support\Str;
use Spatie\LaravelData\Data;
use Spatie\Permission\Models\Role;

class RoleDetailData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public bool $is_system,
        public array $permission_groups,
    ) {}

    public static function fromRole(Role $role): self
    {
        $isSystem = PermissionRegistry::isSystemRole($role->name);
        $granted = $role->permissions->pluck('name');

        return new self(
            id: $role->id,
            name: $role->name,
            slug: Str::slug($role->name),
            is_system: $isSystem,
            permission_groups: collect(PermissionRegistry::grouped())
                ->map(fn (array $permissions, string $group) => [
                    'group' => $group,
                    'permissions' => collect($permissions)
                        ->map(fn (string $label, string $key) => [
                            'key' => $key,
                            'label' => $label,
                            'granted' => $isSystem || $granted->contains($key),
                        ])
                        ->values()
                        ->all(),
                ])
                ->values()
                ->all(),
        );
    }
}
