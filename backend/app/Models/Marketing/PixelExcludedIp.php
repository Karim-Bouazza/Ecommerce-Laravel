<?php

namespace App\Models\Marketing;

use App\Services\PixelTracking\ExcludedIpMatcher;
use Illuminate\Database\Eloquent\Model;

class PixelExcludedIp extends Model
{
    protected $fillable = [
        'pattern',
        'note',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => ExcludedIpMatcher::flush());
        static::deleted(fn () => ExcludedIpMatcher::flush());
    }
}
