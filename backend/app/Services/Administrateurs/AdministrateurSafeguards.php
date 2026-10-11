<?php

namespace App\Services\Administrateurs;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Business rules that keep the back office reachable: nobody can lock themselves
 * out, and the last active system administrator can never be removed.
 */
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
        if (! $target->role?->is_system || ! $target->is_active) {
            return;
        }

        $others = User::query()
            ->whereKeyNot($target->getKey())
            ->where('is_active', true)
            ->whereHas('role', fn ($query) => $query->where('is_system', true))
            ->exists();

        if (! $others) {
            throw new RuntimeException('Au moins un administrateur système actif est requis.');
        }
    }

    public function isSystemRole(int $roleId): bool
    {
        return (bool) Role::query()->whereKey($roleId)->value('is_system');
    }

    /**
     * Logs the user out of every device (sessions are stored in the database).
     */
    public function revokeSessions(User $user): void
    {
        if (config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))->where('user_id', $user->getKey())->delete();
        }
    }
}
