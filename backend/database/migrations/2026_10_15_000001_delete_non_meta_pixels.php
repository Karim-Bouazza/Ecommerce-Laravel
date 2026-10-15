<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('pixels')->where('provider', '!=', 'facebook')->delete();
    }

    public function down(): void
    {
        //
    }
};
