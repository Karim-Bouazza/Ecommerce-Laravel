<?php

namespace App\Services\Administrateurs;

use App\Models\User;
use Illuminate\Support\Arr;
use RuntimeException;

class UpdateAdministrateurService
{
    public function __construct(private readonly AdministrateurSafeguards $safeguards) {}

    /**
     * @throws RuntimeException when the change would lock the back office out
     */
    public function execute(User $user, array $data, ?User $actor = null): User
    {
        $roleChanged = isset($data['role_id']) && (int) $data['role_id'] !== (int) $user->role_id;
        $deactivated = array_key_exists('is_active', $data) && ! $data['is_active'] && $user->is_active;

        if ($roleChanged) {
            $this->safeguards->assertNotSelf($user, $actor, 'Vous ne pouvez pas modifier votre propre rôle.');

            if (! $this->safeguards->isSystemRole((int) $data['role_id'])) {
                $this->safeguards->assertAnotherSystemAdminRemains($user);
            }
        }

        if ($deactivated) {
            $this->safeguards->assertNotSelf($user, $actor, 'Vous ne pouvez pas désactiver votre propre compte.');
            $this->safeguards->assertAnotherSystemAdminRemains($user);
        }

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update(Arr::only($data, ['name', 'email', 'phone', 'role_id', 'password', 'is_active']));

        if ($deactivated || isset($data['password'])) {
            $this->safeguards->revokeSessions($user);
        }

        return $user->load('role');
    }
}
