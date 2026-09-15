<?php

namespace App\Services\Orders\StatusTransitions\Handlers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\Orders\StatusTransitions\OrderStatusTransitionHandler;

class DefaultOrderTransitionHandler implements OrderStatusTransitionHandler
{
    public function execute(Order $order, OrderStatus $to): void
    {
        $order->update(['status' => $to]);
    }
}
