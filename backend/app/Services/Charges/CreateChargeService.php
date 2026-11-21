<?php

namespace App\Services\Charges;

use App\Data\Finance\SaveChargeData;
use App\Models\Finance\Charge;
use Illuminate\Support\Facades\DB;

class CreateChargeService
{
    public function execute(SaveChargeData $data): Charge
    {
        return DB::transaction(function () use ($data): Charge {
            $charge = Charge::create($data->chargeAttributes());

            $charge->products()->sync($data->productIds());

            return $charge;
        });
    }
}
