<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CreateOrderService
{
    public function execute(array $data): Order
    {
        return DB::transaction(function () use ($data) {

            $order = Order::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone_number' => $data['phone_number'],
                'wilaya_id' => $data['wilaya_id'],
                'commune_id' => $data['commune_id'],
                'total_price' => 0,
            ]);

            $totalPrice = 0;

            foreach ($data['items'] as $item) {

                $product = Product::findOrFail($item['product_id']);

                $price = $product->price;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ]);

                $totalPrice += $price * $item['quantity'];
            }

            $order->update([
                'total_price' => $totalPrice,
            ]);

            return $order->load([
                'items.product',
                'wilaya',
                'commune',
            ]);
        });
    }
}
