<?php

namespace App\Services\Orders\StatusTransitions;

use App\Enums\OrderStatus;
use App\Exceptions\InvalidOrderTransitionException;
use App\Services\Orders\StatusTransitions\Handlers\AssignedOrderTransitionHandler;
use App\Services\Orders\StatusTransitions\Handlers\DefaultOrderTransitionHandler;
use App\Services\Orders\StatusTransitions\Handlers\DeliveredOrderTransitionHandler;
use App\Services\Orders\StatusTransitions\Handlers\ReportedOrderTransitionHandler;

final class OrderStatusTransition
{
    public static function from(OrderStatus $from, OrderStatus $to): OrderStatusTransitionHandler
    {
        if (! in_array($to, $from->allowedTransitions(), true)) {
            throw new InvalidOrderTransitionException($from, $to);
        }

        return match ($to) {
            OrderStatus::Assigned => app(AssignedOrderTransitionHandler::class),
            OrderStatus::Delivered => app(DeliveredOrderTransitionHandler::class),
            OrderStatus::Reported => app(ReportedOrderTransitionHandler::class),
            default => app(DefaultOrderTransitionHandler::class),
        };
    }
}
