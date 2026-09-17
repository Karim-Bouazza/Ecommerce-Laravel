<?php

namespace App\Services\Orders\StatusTransitions\Handlers;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\Orders\StatusTransitions\OrderStatusTransitionHandler;
use App\Services\Providers\ZimouPackageService;

class AssignedOrderTransitionHandler implements OrderStatusTransitionHandler
{
    public function __construct(private readonly ZimouPackageService $zimouPackageService)
    {
    }

    public function execute(Order $order, OrderStatus $to): void
    {
        $this->zimouPackageService->createPackage($order);

        $order->update(['status' => $to]);
    }
}
