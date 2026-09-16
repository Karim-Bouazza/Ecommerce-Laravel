<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Creates (or updates) the bootstrap administrator from ADMIN_* env vars,
     * so a fresh deploy always has a way into the Filament panel without an
     * interactive `make:filament-user` step. Safe to run on every deploy:
     * updateOrCreate keys on email, so it never duplicates the account.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seeding.');

            return;
        }

        $role = Role::firstOrCreate(
            ['slug' => 'administrateur'],
            ['name' => 'Administrateur', 'is_system' => true],
        );

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Admin'),
                'phone' => env('ADMIN_PHONE'),
                'password' => $password,
                'is_active' => true,
                'role_id' => $role->id,
            ],
        );
    }
}
