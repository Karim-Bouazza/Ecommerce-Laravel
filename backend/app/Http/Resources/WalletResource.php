<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'balance' => (int) $this->balance,
            'entries_sum_amount' => (int) ($this->entries_sum_amount ?? 0),
            'exits_sum_amount' => (int) ($this->exits_sum_amount ?? 0),
            'remark' => $this->remark,
        ];
    }
}
