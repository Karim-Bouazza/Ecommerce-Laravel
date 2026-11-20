<?php

namespace Database\Seeders;

use App\Models\Users\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seeding.');

            return;
        }

        $this->command?->call('permissions:sync');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Admin'),
                'phone' => env('ADMIN_PHONE'),
                'password' => $password,
                'is_active' => true,
            ],
        );

        $user->syncRoles(Role::findByName(config('permissions.system_roles')[0], 'web'));
    }
}
