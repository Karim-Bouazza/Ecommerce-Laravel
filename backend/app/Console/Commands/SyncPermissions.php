<?php

namespace App\Console\Commands;

use App\Support\PermissionRegistry;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class SyncPermissions extends Command
{
    protected $signature = 'permissions:sync';

    protected $description = 'Sync config/permissions.php into the Spatie tables';

    public function handle(): int
    {
        $keys = PermissionRegistry::all();

        foreach ($keys as $key) {
            Permission::findOrCreate($key, 'web');
        }

        $removed = Permission::query()->where('guard_name', 'web')->whereNotIn('name', $keys)->delete();

        foreach (config('permissions.system_roles') as $name) {
            Role::findOrCreate($name, 'web')->syncPermissions($keys);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $this->info(count($keys)." permissions synced, {$removed} obsolete removed.");

        return self::SUCCESS;
    }
}
