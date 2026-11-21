<?php

namespace App\Data\Auth;

use App\Models\Users\User;
use App\Support\PermissionRegistry;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $avatar,
        public array|null|Optional $role,
    ) {}

    public static function fromUser(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            phone: $user->phone,
            avatar: $user->mediaUrl('avatar'),
            role: $user->relationLoaded('roles')
                ? ($user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                    'is_system' => PermissionRegistry::isSystemRole($user->role->name),
                    'permissions' => $user->role->permissions->pluck('name')->values()->all(),
                ] : null)
                : new Optional(),
        );
    }
}
