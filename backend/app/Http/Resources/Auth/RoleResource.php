<?php

namespace App\Http\Resources\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class RoleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isSystem = PermissionRegistry::isSystemRole($this->name);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => Str::slug($this->name),
            'is_system' => $isSystem,
            'permissions' => $isSystem
                ? ['Tous']
                : $this->permissions
                    ->pluck('name')
                    ->map(fn (string $key) => PermissionRegistry::label($key))
                    ->values()
                    ->all(),
        ];
    }
}
