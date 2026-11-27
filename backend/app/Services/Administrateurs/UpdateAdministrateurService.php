<?php

namespace App\Services\Administrateurs;

use App\Data\Auth\UpdateAdministratorData;
use App\Models\Users\User;
use Illuminate\Support\Arr;
use RuntimeException;
use Spatie\Permission\Models\Role;

class UpdateAdministrateurService
{
    public function __construct(private readonly AdministrateurSafeguards $safeguards) {}

    public function execute(User $user, UpdateAdministratorData $input, ?User $actor = null): User
    {
        $data = $input->toArray();

        $roleChanged = isset($data['role_id']) && (int) $data['role_id'] !== (int) $user->role?->id;
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

        $user->update(Arr::only($data, ['name', 'email', 'phone', 'password', 'is_active']));

        if ($roleChanged) {
            $user->syncRoles(Role::findById((int) $data['role_id'], 'web'));
        }

        if ($deactivated || isset($data['password'])) {
            $this->safeguards->revokeSessions($user);
        }

        return $user->load('roles.permissions');
    }
}
