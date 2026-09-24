<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChargeVersementResource extends JsonResource
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
            'amount' => (int) $this->amount,
            'wallet_id' => $this->wallet_id,
            'wallet_name' => $this->wallet?->name,
            'remark' => $this->remark,
        ];
    }
}
