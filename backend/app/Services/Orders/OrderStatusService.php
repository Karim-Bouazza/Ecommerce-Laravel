<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Services\Orders\StatusTransitions\OrderStatusTransition;
use Illuminate\Support\Facades\DB;

class OrderStatusService
{
    /**
     * @param  array<string, mixed>  $data  Extra data submitted alongside the status change.
     */
    public function change(Order $order, OrderStatus $to, array $data = []): Order
    {
        $from = $order->status;
        $handler = OrderStatusTransition::from($from, $to);

        DB::transaction(function () use ($order, $from, $to, $handler, $data): void {
            $handler->execute($order, $to, $data);

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
