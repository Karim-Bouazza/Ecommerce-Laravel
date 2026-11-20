<?php

namespace App\Http\Resources\Auth;

use App\Support\PermissionRegistry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AdministratorResource extends JsonResource
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
            'is_active' => $this->is_active,
            'is_current' => $request->user()?->is($this->resource) ?? false,
            'role' => $this->whenLoaded('roles', fn () => $this->role ? [
                'id' => $this->role->id,
                'name' => $this->role->name,
                'is_system' => PermissionRegistry::isSystemRole($this->role->name),
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
