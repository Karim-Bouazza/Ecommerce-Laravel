<?php

use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * @var array<string, string>
     */
    private array $map = [
        'Pending Confirmation' => 'pending',
        'Processing' => 'confirmed',
        'Shipped' => 'shipped',
        'Delivered' => 'delivered',
        'Cancelled' => 'cancelled',
    ];

    public function up(): void
    {
        DB::statement('ALTER TABLE orders MODIFY status VARCHAR(30) NOT NULL');
        DB::statement('ALTER TABLE order_status_histories MODIFY status VARCHAR(30) NOT NULL');

        foreach ($this->map as $old => $new) {
            DB::table('orders')->where('status', $old)->update(['status' => $new]);
            DB::table('order_status_histories')->where('status', $old)->update(['status' => $new]);
        }

        $values = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status) => "'{$status->value}'")
            ->implode(',');

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT '".OrderStatus::Pending->value."'");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE orders MODIFY status VARCHAR(30) NOT NULL');

        foreach (array_flip($this->map) as $new => $old) {
            DB::table('orders')->where('status', $new)->update(['status' => $old]);
            DB::table('order_status_histories')->where('status', $new)->update(['status' => $old]);
        }

        $values = collect(array_keys($this->map))
            ->map(fn (string $value) => "'{$value}'")
            ->implode(',');

        DB::statement("ALTER TABLE orders MODIFY status ENUM($values) NOT NULL DEFAULT 'Pending Confirmation'");
    }
};
