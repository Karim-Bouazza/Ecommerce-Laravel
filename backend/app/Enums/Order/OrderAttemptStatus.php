<?php

namespace App\Enums\Order;

enum OrderAttemptStatus: string
{
    case OrderCreated = 'order_created';
    case ValidationFailed = 'validation_failed';
    case Error = 'error';
}
