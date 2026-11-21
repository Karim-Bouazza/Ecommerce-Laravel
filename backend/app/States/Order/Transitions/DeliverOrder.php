<?php

namespace App\States\Order\Transitions;

use App\Enums\Stock\StockMovementType;
use App\Models\Inventory\Stock;
use App\Models\Inventory\Warehouse;
use App\Models\Order\Order;
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

            $current = Stock::lockAndGetInDepot($warehouse->id, $item->product_id);

            $warehouse->stockMovements()->create([
                'product_id' => $item->product_id,
                'type' => StockMovementType::Out,
                'quantity' => $item->quantity,
                'resulting_quantity' => max(0, $current - $item->quantity),
            ]);
        }
    }
}
