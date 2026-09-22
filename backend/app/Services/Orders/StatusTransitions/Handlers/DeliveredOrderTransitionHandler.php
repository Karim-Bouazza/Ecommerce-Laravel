<?php

namespace App\Services\Orders\StatusTransitions\Handlers;

use App\Enums\OrderStatus;
use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\Stock;
use App\Models\Warehouse;
use App\Services\Orders\StatusTransitions\OrderStatusTransitionHandler;

class DeliveredOrderTransitionHandler implements OrderStatusTransitionHandler
{
    public function execute(Order $order, OrderStatus $to, array $data = []): void
    {
        $this->writeOutMovements($order);

        $order->update(['status' => $to]);
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
