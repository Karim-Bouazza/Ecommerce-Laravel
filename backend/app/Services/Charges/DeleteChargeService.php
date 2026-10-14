<?php

namespace App\Services\Charges;

use App\Enums\Charge\ChargePaymentStatus;
use App\Models\Finance\Charge;
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
