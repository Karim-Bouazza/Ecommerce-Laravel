<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSettingColorsTheme extends Model
{
    protected $table = 'site_settings_colors_theme';

    protected $fillable = [
        'primary_color',
        'primary_dark_color',
        'primary_mid_color',
        'accent_color',
        'accent_light_color',
        'contrast_color',
    ];

    public static function current(): self
    {
        $theme = static::query()->firstOrCreate([]);

        if ($theme->wasRecentlyCreated) {
            $theme->refresh();
        }

        return $theme;
    }
}
