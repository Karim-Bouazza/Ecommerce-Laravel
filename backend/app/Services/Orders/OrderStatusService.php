<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\Orders\StatusTransitions\OrderStatusTransition;
use Illuminate\Support\Facades\DB;

class OrderStatusService
{
    public function change(Order $order, OrderStatus $to): Order
    {
        $from = $order->status;
        $handler = OrderStatusTransition::from($from, $to);

        DB::transaction(function () use ($order, $from, $to, $handler): void {
            $handler->execute($order, $to);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => $to,
                'previous_status' => $from,
                'user_id' => auth()->id(),
            ]);
        });

        return $order;
    }
}
