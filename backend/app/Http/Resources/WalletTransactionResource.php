<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletTransactionResource extends JsonResource
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
            'amount' => (int) $this->amount,
            'remark' => $this->remark,
            'category' => $this->category->value,
            'category_label' => $this->category->label(),
            'category_color' => $this->category->color(),
        ];
    }
}
