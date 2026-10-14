<?php

namespace App\Http\Controllers\Api\Settings;

use App\Enums\Storefront\SiteLanguage;
use App\Http\Controllers\Controller;
use App\Models\Settings\SiteSettingLanguage;
use Illuminate\Http\Request;

class SiteSettingLanguageController extends Controller
{
    public function show(): array
    {
        return ['language' => SiteSettingLanguage::current()->language->value];
    }

    public function update(Request $request): array
    {
        $validated = $request->validate([
            'language' => ['required', 'string', 'in:'.implode(',', SiteLanguage::values())],
        ]);

        $setting = SiteSettingLanguage::current();
        $setting->update($validated);

        return ['language' => $setting->fresh()->language->value];
    }
}
