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
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('free_delivery')->default(false)->after('provider_order_id');
            $table->boolean('can_be_opened')->default(false)->after('free_delivery');
            $table->string('provider_office_id')->nullable()->after('can_be_opened');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['free_delivery', 'can_be_opened', 'provider_office_id']);
        });
    }
};
