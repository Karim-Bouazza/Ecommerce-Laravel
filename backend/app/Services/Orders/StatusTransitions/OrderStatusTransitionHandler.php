<?php

namespace App\Services\Orders\StatusTransitions;

use App\Enums\OrderStatus;
use App\Models\Order;

interface OrderStatusTransitionHandler
{
    /**
     * Apply the side effects of moving $order to $to and persist the new status.
     */
    public function execute(Order $order, OrderStatus $to): void;
}
