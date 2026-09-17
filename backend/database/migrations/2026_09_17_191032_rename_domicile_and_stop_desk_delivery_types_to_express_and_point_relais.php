<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('orders')->where('delivery_type', 'domicile')->update(['delivery_type' => 'express']);
        DB::table('orders')->where('delivery_type', 'stop_desk')->update(['delivery_type' => 'point_relais']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('orders')->where('delivery_type', 'express')->update(['delivery_type' => 'domicile']);
        DB::table('orders')->where('delivery_type', 'point_relais')->update(['delivery_type' => 'stop_desk']);
    }
};
