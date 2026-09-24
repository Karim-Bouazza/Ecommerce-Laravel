<?php

namespace App\Services\Charges;

use App\Models\Charge;

class CreateChargeService
{
    public function execute(array $data): Charge
    {
        $charge = Charge::create([
            'category' => $data['category'],
            'type' => $data['type'],
            'order_trigger' => $data['order_trigger'] ?? null,
            'recurrence_frequency' => $data['recurrence_frequency'] ?? null,
            'name' => $data['name'],
            'amount' => $data['amount'],
            'all_products' => $data['all_products'] ?? false,
            'starts_at' => $data['starts_at'] ?? null,
            'ends_at' => $data['ends_at'] ?? null,
        ]);

        $charge->products()->sync($charge->all_products ? [] : ($data['product_ids'] ?? []));

        return $charge;
    }
}
