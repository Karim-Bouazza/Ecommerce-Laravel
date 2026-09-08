<?php

namespace App\Services\Orders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use RuntimeException;

class MarkOrderAsPaidService
{
    public function execute(Order $order): Order
    {
        if ($order->status !== OrderStatus::Delivered) {
            throw new RuntimeException('Seule une commande livrée peut être marquée comme payée.');
        }

        $order->update(['payment_status' => PaymentStatus::Paid]);

        return $order;
    }
}
