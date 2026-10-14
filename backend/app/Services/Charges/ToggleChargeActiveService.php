<?php

namespace App\Services\Charges;

use App\Models\Finance\Charge;
use Illuminate\Support\Facades\DB;

class ToggleChargeActiveService
{
    /**
     * Pausing a charge stops it from accruing from now on; what it already cost is kept.
     */
    public function execute(Charge $charge): Charge
    {
        DB::transaction(function () use ($charge): void {
            if ($charge->is_active) {
                $charge->pauses()->create(['paused_at' => now()]);
            } else {
                $charge->pauses()->whereNull('resumed_at')->update(['resumed_at' => now()]);
            }

            $charge->update(['is_active' => ! $charge->is_active]);
        });

        return $charge->refresh()->refreshAmounts();
    }
}
