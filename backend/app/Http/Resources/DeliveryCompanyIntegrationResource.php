<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryCompanyIntegrationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'company_key' => $this->company_key,
            'name' => $this->name,
            'base_url' => $this->base_url,
            'has_token' => filled($this->api_token),
            'updated_at' => $this->updated_at,
        ];
    }
}
