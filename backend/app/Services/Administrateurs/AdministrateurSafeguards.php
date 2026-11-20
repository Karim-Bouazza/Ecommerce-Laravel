<?php

namespace App\Services\Administrateurs;

use App\Models\Users\User;
use App\Support\PermissionRegistry;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Spatie\Permission\Models\Role;

class AdministrateurSafeguards
{
    public function assertNotSelf(User $target, ?User $actor, string $message): void
    {
        if ($actor && $actor->is($target)) {
            throw new RuntimeException($message);
        }
    }

    public function assertAnotherSystemAdminRemains(User $target): void
    {
        if (! $target->isSystemAdmin() || ! $target->is_active) {
            return;
        }

        $others = User::query()
            ->whereKeyNot($target->getKey())
            ->where('is_active', true)
            ->role(config('permissions.system_roles'))
            ->exists();

        if (! $others) {
            throw new RuntimeException('Au moins un administrateur système actif est requis.');
        }
    }

    public function isSystemRole(int $roleId): bool
    {
        $name = Role::query()->whereKey($roleId)->value('name');

        return $name !== null && PermissionRegistry::isSystemRole($name);
    }

    public function revokeSessions(User $user): void
    {
        if (config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))->where('user_id', $user->getKey())->delete();
        }
    }
}
