<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings_colors_theme', function (Blueprint $table) {
            $table->id();
            $table->string('primary_color', 7)->default('#007fff');
            $table->string('primary_dark_color', 7)->default('#0018b8');
            $table->string('primary_mid_color', 7)->default('#0055ff');
            $table->string('accent_color', 7)->default('#00cff0');
            $table->string('accent_light_color', 7)->default('#7defff');
            $table->string('contrast_color', 7)->default('#ffffff');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings_colors_theme');
    }
};
