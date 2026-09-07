<?php

use App\Models\Warehouse;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Warehouse::query()->where('name', 'Default')->exists()) {
            return;
        }

        Warehouse::create([
            'name' => 'Default',
            'all_wilayas' => true,
            'all_products' => true,
            'active' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Warehouse::query()->where('name', 'Default')->delete();
    }
};
