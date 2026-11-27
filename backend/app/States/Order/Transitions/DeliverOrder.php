<?php

namespace App\States\Order\Transitions;

use App\Enums\Stock\StockMovementType;
use App\Models\Inventory\Warehouse;
use App\Models\Order\Order;
use App\Services\Warehouses\RecordStockMovementService;
use Spatie\ModelStates\DefaultTransition;

class DeliverOrder extends DefaultTransition
{
    public function handle(): Order
    {
        $this->writeOutMovements($this->model);

        return parent::handle();
    }

    private function writeOutMovements(Order $order): void
    {
        $fallbackWarehouse = Warehouse::default();

        foreach ($order->items()->with('warehouse')->get() as $item) {
            $warehouse = $item->warehouse ?? $fallbackWarehouse;

            if (! $warehouse || ! $item->product_id || $item->quantity <= 0) {
                continue;
            }

            app(RecordStockMovementService::class)->execute(
                $warehouse,
                $item->product_id,
                StockMovementType::Out,
                $item->quantity,
            );
        }
    }
}
