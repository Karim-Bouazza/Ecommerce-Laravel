<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FournisseurResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'remark' => $this->remark,
            'address' => $this->address,
            'total_dues' => $this->totalDues(),
            'total_paid' => $this->totalPaid(),
            'remaining_amount' => $this->remainingAmount(),
        ];
    }
}
