<?php

namespace App\Services\Orders\StatusTransitions;

use App\Enums\Order\OrderStatus;
use App\Models\Order\Order;

interface OrderStatusTransitionHandler
{
    /**
     * Apply the side effects of moving $order to $to and persist the new status.
     *
     * @param  array<string, mixed>  $data  Extra data submitted alongside the status change.
     */
    public function execute(Order $order, OrderStatus $to, array $data = []): void;
}
