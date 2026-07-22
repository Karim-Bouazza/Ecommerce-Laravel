<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Services\Orders\CreateOrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private readonly CreateOrderService $createOrderService,
    )
    {
    }

    public function store(CreateOrderRequest $request)
    {
        $order = $this->createOrderService->execute(
            $request->validated()
        );

        return response()->json($order, 201);
    }
}
