<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaiementResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'date' => $this->date?->format('Y-m-d'),
            'creator_name' => $this->creator?->name,
            'wallet_id' => $this->wallet_id,
            'wallet_name' => $this->wallet?->name,
            'amount' => (int) $this->amount,
            'remark' => $this->remark,
            'delivery_company_integration_id' => $this->delivery_company_integration_id,
            'delivery_partner_name' => $this->deliveryCompanyIntegration?->name,
        ];
    }
}
