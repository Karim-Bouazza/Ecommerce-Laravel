<?php

namespace App\Data\Marketing;

use App\Models\Marketing\Pixel;
use Spatie\LaravelData\Data;

class PixelData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $provider,
        public string $pixel_id,
        public bool $is_active,
    ) {}

    public static function fromPixel(Pixel $pixel): self
    {
        return new self(
            id: $pixel->id,
            name: $pixel->name,
            provider: $pixel->provider,
            pixel_id: $pixel->pixel_id,
            is_active: (bool) $pixel->is_active,
        );
    }
}
