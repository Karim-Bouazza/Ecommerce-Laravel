<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSettingLogo extends Model
{
    protected $table = 'site_settings_logo';

    protected $fillable = [
        'logo_path',
    ];

    protected $hidden = [
        'logo_path',
    ];

    protected $appends = [
        'logo_url',
    ];

    public static function current(): self
    {
        $logo = static::query()->firstOrCreate([]);

        if ($logo->wasRecentlyCreated) {
            $logo->refresh();
        }

        return $logo;
    }

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null,
        );
    }
}
