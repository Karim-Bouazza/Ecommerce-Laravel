<?php

namespace App\Services\Orders;

use App\Enums\Order\OrderStatus;
use App\Exceptions\InvalidOrderTransitionException;
use App\Models\Order\Order;
use App\Models\Order\OrderStatusHistory;
use Illuminate\Support\Facades\DB;
use Spatie\ModelStates\Exceptions\CouldNotPerformTransition;

class OrderStatusService
{
    /**
     * @param  array<string, mixed>  $data  Extra data submitted alongside the status change.
     */
    public function change(Order $order, OrderStatus $to, array $data = []): Order
    {
        $from = $order->status->status();

        DB::transaction(function () use ($order, $from, $to, $data): void {
            try {
                $order->status->transitionTo($to->value, $data);
            } catch (CouldNotPerformTransition) {
                throw new InvalidOrderTransitionException($from, $to);
            }

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
