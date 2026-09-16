<?php

namespace App\Http\Resources\Role;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'is_system' => $this->is_system,
            'permission_groups' => collect(PermissionRegistry::grouped())
                ->map(fn (array $permissions, string $group) => [
                    'group' => $group,
                    'permissions' => collect($permissions)
                        ->map(fn (string $label, string $key) => [
                            'key' => $key,
                            'label' => $label,
                            'granted' => $this->hasPermission($key),
                        ])
                        ->values()
                        ->all(),
                ])
                ->values()
                ->all(),
        ];
    }
}
