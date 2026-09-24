<?php

namespace App\Services\Charges;

use App\Enums\ChargePaymentStatus;
use App\Models\Charge;
use RuntimeException;

class UpdateChargeService
{
    public function execute(Charge $charge, array $data): Charge
    {
        if ($charge->paymentStatus() !== ChargePaymentStatus::Unpaid) {
            throw new RuntimeException('Une charge avec des versements ne peut pas être modifiée.');
        }

        $charge->update([
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
