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

    /**
     * Orders still waiting for a confirmation decision.
     *
     * @return array<int, OrderStatus>
     */
    public static function pending(): array
    {
        return [
            OrderStatus::New,
            OrderStatus::Reported,
            OrderStatus::Call1,
            OrderStatus::Call2,
            OrderStatus::Call3,
            OrderStatus::Unreachable,
            OrderStatus::ToCheck,
            OrderStatus::Scheduled,
        ];
    }

    /**
     * Orders whose delivery outcome is known (delivered or came back).
     *
     * @return array<int, OrderStatus>
     */
    public static function deliveryResolved(): array
    {
        return [
            OrderStatus::Delivered,
            OrderStatus::Returned,
            OrderStatus::ReturnInProgress,
        ];
    }
}
