<?php

namespace App\Data\Marketing;

use App\Models\Marketing\PixelExcludedIp;
use App\Services\PixelTracking\ExcludedIpMatcher;
use Spatie\LaravelData\Data;

class PixelExcludedIpData extends Data
{
    public function __construct(
        public int $id,
        public string $pattern,
        public mixed $type,
        public ?string $note,
        public ?string $created_at,
    ) {}

    public static function fromEntry(PixelExcludedIp $entry): self
    {
        return new self(
            id: $entry->id,
            pattern: $entry->pattern,
            type: ExcludedIpMatcher::type($entry->pattern),
            note: $entry->note,
            created_at: $entry->created_at?->toIso8601String(),
        );
    }
}
