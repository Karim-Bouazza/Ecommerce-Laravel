<?php

namespace App\Http\Resources\Role;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
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
            'permissions' => $this->is_system
                ? ['Tous']
                : collect($this->permissions ?? [])
                    ->map(fn (string $key) => PermissionRegistry::label($key))
                    ->values()
                    ->all(),
        ];
    }
}
