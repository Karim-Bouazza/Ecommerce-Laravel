<?php

namespace App\Services\Charges;

use App\Models\Charge;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateChargeService
{
    /**
     * @param  array<string, mixed>  $data  Normalized by StoreChargeRequest::chargeData().
     */
    public function execute(array $data): Charge
    {
        return DB::transaction(function () use ($data): Charge {
            $charge = Charge::create(Arr::except($data, 'product_ids'));

            $charge->products()->sync($data['product_ids']);

            return $charge;
        });
    }
}
