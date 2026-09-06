<?php

use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $values = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::Pending->value."'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $values = collect(OrderStatus::cases())
            ->filter(fn (OrderStatus $status) => $status !== OrderStatus::Scheduled)
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        DB::statement("UPDATE orders SET status = '".OrderStatus::Pending->value."' WHERE status = '".OrderStatus::Scheduled->value."'");
        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::Pending->value."'");
    }
};
