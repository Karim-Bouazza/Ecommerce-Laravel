<?php

use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->timestamp('date_report')->nullable()->after('scheduled_at');
        });

        $values = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::New->value."'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE orders SET status = '".OrderStatus::New->value."' WHERE status = '".OrderStatus::Reported->value."'");

        $values = collect(OrderStatus::cases())
            ->filter(fn (OrderStatus $status) => $status !== OrderStatus::Reported)
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::New->value."'");

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('date_report');
        });
    }
};
