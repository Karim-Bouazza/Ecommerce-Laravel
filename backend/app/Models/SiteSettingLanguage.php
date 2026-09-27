<?php

namespace App\Models;

use App\Enums\SiteLanguage;
use Illuminate\Database\Eloquent\Model;

class SiteSettingLanguage extends Model
{
    protected $table = 'site_settings_language';

    protected $fillable = [
        'language',
    ];

    protected function casts(): array
    {
        return [
            'language' => SiteLanguage::class,
        ];
    }

    public static function current(): self
    {
        $setting = static::query()->firstOrCreate([]);

        if ($setting->wasRecentlyCreated) {
            $setting->refresh();
        }

        return $setting;
    }
}
