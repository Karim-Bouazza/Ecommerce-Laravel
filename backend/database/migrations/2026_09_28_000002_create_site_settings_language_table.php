<?php

use App\Enums\SiteLanguage;
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
        Schema::create('site_settings_language', function (Blueprint $table) {
            $table->id();
            $table->enum('language', SiteLanguage::values())->default(SiteLanguage::Fr->value);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings_language');
    }
};
