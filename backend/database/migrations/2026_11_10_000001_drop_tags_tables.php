<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('product_tag');
        Schema::dropIfExists('tags');

        DB::table('roles')->whereNotNull('permissions')->get()->each(function ($role) {
            $permissions = json_decode($role->permissions, true);

            if (! is_array($permissions)) {
                return;
            }

            $filtered = array_values(array_filter(
                $permissions,
                fn ($permission) => ! str_starts_with((string) $permission, 'tags.'),
            ));

            if ($filtered !== $permissions) {
                DB::table('roles')->where('id', $role->id)->update(['permissions' => json_encode($filtered)]);
            }
        });
    }

    public function down(): void
    {
        //
    }
};
