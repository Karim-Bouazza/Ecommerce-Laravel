<?php

namespace App\Services\Charges;

use App\Data\Finance\SaveChargeData;
use App\Models\Finance\Charge;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdateChargeService
{
    /**
     * A charge with payments stays editable (e.g. to set an end date), as long as
     * what it owes does not fall below what was already paid.
     */
    public function execute(Charge $charge, SaveChargeData $data): Charge
    {
        return DB::transaction(function () use ($charge, $data): Charge {
            $charge->update($data->chargeAttributes());
            $charge->products()->sync($data->productIds());

            $charge->refresh()->refreshAmounts();

            if ($charge->paidAmount() > $charge->dueAmount()) {
                throw new RuntimeException('Le montant dû deviendrait inférieur au montant déjà versé ('.$charge->paidAmount().' DA).');
            }

            return $charge;
        });
    }
}
