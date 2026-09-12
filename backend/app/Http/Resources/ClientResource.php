<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => trim("{$this->first_name} {$this->last_name}"),
            'phone_number' => $this->phone_number,
            'wilaya_id' => $this->wilaya_id,
            'wilaya' => $this->wilaya?->name,
            'commune_id' => $this->commune_id,
            'commune' => $this->commune?->name,
            'is_blacklisted' => (bool) $this->is_blacklisted,
        ];
    }
}
