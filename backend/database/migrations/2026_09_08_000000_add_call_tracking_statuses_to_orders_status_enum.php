<?php

use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const NEW_STATUSES = [
        OrderStatus::Call1,
        OrderStatus::Call2,
        OrderStatus::Call3,
        OrderStatus::Unreachable,
        OrderStatus::ToCheck,
        OrderStatus::Duplicated,
        OrderStatus::FakeOrder,
        OrderStatus::ConfirmedBot,
        OrderStatus::ConfirmedNoStock,
    ];

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
            ->filter(fn (OrderStatus $status) => ! in_array($status, self::NEW_STATUSES, true))
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        foreach (self::NEW_STATUSES as $status) {
            DB::statement("UPDATE orders SET status = '".OrderStatus::Pending->value."' WHERE status = '{$status->value}'");
        }

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::Pending->value."'");
    }
};
