<?php

namespace App\Services\Charges;

use App\Enums\ChargePaymentStatus;
use App\Models\Charge;
use RuntimeException;

class DeleteChargeService
{
    public function execute(Charge $charge): void
    {
        if ($charge->paymentStatus() !== ChargePaymentStatus::Unpaid) {
            throw new RuntimeException('Une charge avec des versements ne peut pas être supprimée.');
        }

        $charge->delete();
    }
}
