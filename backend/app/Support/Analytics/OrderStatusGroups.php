<?php

namespace App\Support\Analytics;

use App\Enums\Order\OrderStatus;

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

    /**
     * Orders waiting for a first decision or still being called.
     *
     * @return array<int, OrderStatus>
     */
    public static function awaitingConfirmation(): array
    {
        return [
            OrderStatus::New,
            OrderStatus::Call1,
            OrderStatus::Call2,
            OrderStatus::Call3,
            OrderStatus::Unreachable,
            OrderStatus::ToCheck,
        ];
    }

    /**
     * Orders put aside for later.
     *
     * @return array<int, OrderStatus>
     */
    public static function postponed(): array
    {
        return [OrderStatus::Reported, OrderStatus::Scheduled];
    }

    /**
     * Fake numbers and duplicates, left out of the valid orders.
     *
     * @return array<int, OrderStatus>
     */
    public static function invalid(): array
    {
        return [OrderStatus::FakeOrder, OrderStatus::Duplicated];
    }

    /**
     * Statuses of an order handed over to delivery.
     *
     * @return array<int, OrderStatus>
     */
    public static function inDelivery(): array
    {
        return [OrderStatus::Assigned, OrderStatus::Shipped];
    }
}
