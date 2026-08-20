<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wilayas', function (Blueprint $table) {
            $table->unsignedInteger('price_domicile')->default(0)->after('name');
            $table->unsignedInteger('price_stop_desk')->default(0)->after('price_domicile');
        });
    }

    public function down(): void
    {
        Schema::table('wilayas', function (Blueprint $table) {
            $table->dropColumn(['price_domicile', 'price_stop_desk']);
        });
    }
};
