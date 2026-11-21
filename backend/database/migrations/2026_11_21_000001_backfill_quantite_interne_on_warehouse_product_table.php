<?php

use App\Enums\Stock\StockMovementType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $balances = DB::table('warehouse_stock_movements')
            ->selectRaw(
                'warehouse_id, product_id, SUM(CASE WHEN type = ? THEN quantity ELSE -quantity END) AS balance',
                [StockMovementType::In->value]
            )
            ->groupBy('warehouse_id', 'product_id')
            ->get();

        foreach ($balances as $row) {
            DB::table('warehouse_product')->updateOrInsert(
                ['warehouse_id' => $row->warehouse_id, 'product_id' => $row->product_id],
                ['quantite_interne' => max(0, (int) $row->balance)],
            );
        }
    }

    public function down(): void
    {
        //
    }
};
