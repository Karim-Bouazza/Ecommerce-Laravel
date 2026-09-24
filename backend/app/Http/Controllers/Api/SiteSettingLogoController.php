<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteSettingLogoRequest;
use App\Models\SiteSettingLogo;
use Illuminate\Support\Facades\Storage;

class SiteSettingLogoController extends Controller
{
    public function show()
    {
        return SiteSettingLogo::current();
    }

    public function update(UpdateSiteSettingLogoRequest $request)
    {
        $logo = SiteSettingLogo::current();
        $previousPath = $logo->getRawOriginal('logo_path');

        $logo->update([
            'logo_path' => $request->file('logo')->store('logo', 'public'),
        ]);

        if ($previousPath) {
            Storage::disk('public')->delete($previousPath);
        }

        return $logo;
    }
}
