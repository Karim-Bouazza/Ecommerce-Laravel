<?php

namespace App\Services\Charges;

use App\Models\Finance\Charge;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class UpdateChargeService
{
    /**
     * A charge with payments stays editable (e.g. to set an end date), as long as
     * what it owes does not fall below what was already paid.
     *
     * @param  array<string, mixed>  $data  Normalized by StoreChargeRequest::chargeData().
     */
    public function execute(Charge $charge, array $data): Charge
    {
        return DB::transaction(function () use ($charge, $data): Charge {
            $charge->update(Arr::except($data, 'product_ids'));
            $charge->products()->sync($data['product_ids']);

            $charge->refresh()->refreshAmounts();

            if ($charge->paidAmount() > $charge->dueAmount()) {
                throw new RuntimeException('Le montant dû deviendrait inférieur au montant déjà versé ('.$charge->paidAmount().' DA).');
            }

            return $charge;
        });
    }
}
