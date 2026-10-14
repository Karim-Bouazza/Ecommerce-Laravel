<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSiteSettingColorsThemeRequest;
use App\Models\Settings\SiteSettingColorsTheme;

class SiteSettingColorsThemeController extends Controller
{
    public function show()
    {
        return SiteSettingColorsTheme::current();
    }

    public function update(UpdateSiteSettingColorsThemeRequest $request)
    {
        $theme = SiteSettingColorsTheme::current();
        $theme->update($request->validated());

        return $theme;
    }
}
