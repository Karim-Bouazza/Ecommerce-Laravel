<?php

namespace App\Services\Administrateurs;

use App\Models\Users\User;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DeleteAdministrateurService
{
    public function __construct(private readonly AdministrateurSafeguards $safeguards) {}

    /**
     * @throws RuntimeException when the account cannot be removed safely
     */
    public function execute(User $user, ?User $actor = null): void
    {
        $this->safeguards->assertNotSelf($user, $actor, 'Vous ne pouvez pas supprimer votre propre compte.');
        $this->safeguards->assertAnotherSystemAdminRemains($user);

        $this->safeguards->revokeSessions($user);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();
    }
}
