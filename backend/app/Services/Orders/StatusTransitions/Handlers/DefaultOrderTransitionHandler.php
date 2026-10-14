<?php

namespace App\Services\Orders\StatusTransitions\Handlers;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;
use App\Services\Orders\StatusTransitions\OrderStatusTransitionHandler;

class DefaultOrderTransitionHandler implements OrderStatusTransitionHandler
{
    public function execute(Order $order, OrderStatus $to, array $data = []): void
    {
        $order->update(['status' => $to]);
    }
}
