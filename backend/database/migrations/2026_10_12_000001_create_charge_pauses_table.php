<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('charge_pauses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('charge_id')->constrained()->cascadeOnDelete();
            $table->timestamp('paused_at');
            $table->timestamp('resumed_at')->nullable();
            $table->timestamps();
        });

        // Charges already disabled are considered paused since their last update.
        DB::table('charges')->where('is_active', false)->get(['id', 'updated_at'])
            ->each(fn ($charge) => DB::table('charge_pauses')->insert([
                'charge_id' => $charge->id,
                'paused_at' => $charge->updated_at ?? now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
    }

    public function down(): void
    {
        Schema::dropIfExists('charge_pauses');
    }
};
