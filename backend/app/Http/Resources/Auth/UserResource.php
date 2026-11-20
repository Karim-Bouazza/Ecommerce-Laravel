<?php

namespace App\Http\Resources\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'role' => $this->whenLoaded('roles', fn () => $this->role ? [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'is_system' => PermissionRegistry::isSystemRole($this->role->name),
                'permissions' => $this->role->permissions->pluck('name')->values()->all(),
            ] : null),
        ];
    }
}
