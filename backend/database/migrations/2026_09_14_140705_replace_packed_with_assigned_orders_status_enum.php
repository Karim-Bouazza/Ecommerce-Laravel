<?php

use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const OLD_VALUE = 'packed';

    private const NEW_VALUE = 'assigned';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $finalValues = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        // Widen the enum first so it accepts both the old and new value while rows are migrated.
        DB::statement("ALTER TABLE orders MODIFY status ENUM($finalValues,'".self::OLD_VALUE."') NOT NULL DEFAULT '".OrderStatus::New->value."'");

        DB::statement("UPDATE orders SET status = '".self::NEW_VALUE."' WHERE status = '".self::OLD_VALUE."'");
        DB::statement("UPDATE order_status_histories SET status = '".self::NEW_VALUE."' WHERE status = '".self::OLD_VALUE."'");

        DB::statement("ALTER TABLE orders MODIFY status ENUM($finalValues) NOT NULL DEFAULT '".OrderStatus::New->value."'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $restoredValues = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => $status->value === self::NEW_VALUE ? self::OLD_VALUE : $status->value)
            ->map(fn (string $value) => "'{$value}'")
            ->implode(',');

        // Widen the enum first so it accepts both the old and new value while rows are migrated back.
        DB::statement("ALTER TABLE orders MODIFY status ENUM($restoredValues,'".self::NEW_VALUE."') NOT NULL DEFAULT '".OrderStatus::New->value."'");

        DB::statement("UPDATE orders SET status = '".self::OLD_VALUE."' WHERE status = '".self::NEW_VALUE."'");
        DB::statement("UPDATE order_status_histories SET status = '".self::OLD_VALUE."' WHERE status = '".self::NEW_VALUE."'");

        DB::statement("ALTER TABLE orders MODIFY status ENUM($restoredValues) NOT NULL DEFAULT '".OrderStatus::New->value."'");
    }
};
