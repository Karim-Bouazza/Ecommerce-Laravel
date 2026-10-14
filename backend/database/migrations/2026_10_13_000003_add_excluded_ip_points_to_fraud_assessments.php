<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fraud_assessments', function (Blueprint $table) {
            $table->unsignedTinyInteger('excluded_ip_points')->default(0)->after('outcome_points');
        });
    }

    public function down(): void
    {
        Schema::table('fraud_assessments', function (Blueprint $table) {
            $table->dropColumn('excluded_ip_points');
        });
    }
};
