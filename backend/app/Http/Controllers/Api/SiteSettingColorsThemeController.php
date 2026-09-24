<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteSettingColorsThemeRequest;
use App\Models\SiteSettingColorsTheme;

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
