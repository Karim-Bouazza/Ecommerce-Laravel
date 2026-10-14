<?php

namespace App\Http\Requests\Finance;

class UpdateChargeRequest extends StoreChargeRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('charges.edit');
    }
}
