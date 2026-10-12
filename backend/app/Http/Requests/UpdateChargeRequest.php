<?php

namespace App\Http\Requests;

class UpdateChargeRequest extends StoreChargeRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('charges.edit');
    }
}
