<?php

namespace App\Http\Resources\Marketing;

use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PixelExcludedIpResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pattern' => $this->pattern,
            'type' => ExcludedIpMatcher::type($this->pattern),
            'note' => $this->note,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
