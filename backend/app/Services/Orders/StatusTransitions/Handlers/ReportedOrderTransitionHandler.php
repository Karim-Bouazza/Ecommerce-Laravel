<?php

namespace App\Services\Orders\StatusTransitions\Handlers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\Orders\StatusTransitions\OrderStatusTransitionHandler;

class ReportedOrderTransitionHandler implements OrderStatusTransitionHandler
{
    public function execute(Order $order, OrderStatus $to, array $data = []): void
    {
        $order->update([
            'status' => $to,
            'date_report' => $data['date_report'] ?? null,
        ]);
    }
}
