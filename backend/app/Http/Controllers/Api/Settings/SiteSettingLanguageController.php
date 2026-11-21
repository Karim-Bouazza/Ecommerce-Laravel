<?php

namespace App\Http\Controllers\Api\Settings;

use App\Data\Settings\UpdateSiteLanguageData;
use App\Http\Controllers\Controller;
use App\Models\Settings\SiteSettingLanguage;

class SiteSettingLanguageController extends Controller
{
    public function show(): array
    {
        return ['language' => SiteSettingLanguage::current()->language->value];
    }

    public function update(UpdateSiteLanguageData $data): array
    {
        $setting = SiteSettingLanguage::current();
        $setting->update(['language' => $data->language]);

        return ['language' => $setting->fresh()->language->value];
    }
}
