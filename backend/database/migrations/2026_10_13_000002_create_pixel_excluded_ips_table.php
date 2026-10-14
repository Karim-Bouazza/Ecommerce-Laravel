<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pixel_excluded_ips', function (Blueprint $table) {
            $table->id();
            $table->string('pattern', 45)->unique();
            $table->string('note')->nullable();
            $table->timestamps();
        });

        DB::table('pixel_excluded_ips')->insert([
            'pattern' => '105.235.133.*',
            'note' => 'Plage exclue par défaut',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pixel_excluded_ips');
    }
};
