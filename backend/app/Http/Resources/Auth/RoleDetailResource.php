<?php

namespace App\Http\Resources\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class RoleDetailResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isSystem = PermissionRegistry::isSystemRole($this->name);
        $granted = $this->permissions->pluck('name');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => Str::slug($this->name),
            'is_system' => $isSystem,
            'permission_groups' => collect(PermissionRegistry::grouped())
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
        ];
    }
}
