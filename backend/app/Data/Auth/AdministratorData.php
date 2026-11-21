<?php

namespace App\Data\Auth;

use App\Models\Users\User;
use App\Support\PermissionRegistry;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

class AdministratorData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $avatar,
        public mixed $is_active,
        public bool $is_current,
        public array|null|Optional $role,
        public ?string $created_at,
    ) {}

    public static function fromUser(User $user, ?User $current = null): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            phone: $user->phone,
            avatar: $user->avatar ? Storage::url($user->avatar) : null,
            is_active: $user->is_active,
            is_current: $current?->is($user) ?? false,
            role: $user->relationLoaded('roles')
                ? ($user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                    'is_system' => PermissionRegistry::isSystemRole($user->role->name),
                ] : null)
                : new Optional(),
            created_at: $user->created_at?->toIso8601String(),
        );
    }
}
