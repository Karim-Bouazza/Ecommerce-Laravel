<?php

namespace App\Support\Analytics;

use App\Enums\OrderStatus;

class OrderStatusGroups
{
    /**
     * Orders that went through confirmation, whatever happened afterwards.
     *
     * @return array<int, OrderStatus>
     */
    public static function confirmedOrLater(): array
    {
        return [
            OrderStatus::Confirmed,
            OrderStatus::ConfirmedBot,
            OrderStatus::ConfirmedNoStock,
            OrderStatus::Assigned,
            OrderStatus::Shipped,
            OrderStatus::Delivered,
            OrderStatus::ReturnInProgress,
            OrderStatus::Returned,
        ];
    }
}
