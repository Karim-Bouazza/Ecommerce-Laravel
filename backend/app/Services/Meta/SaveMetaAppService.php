<?php

namespace App\Services\Meta;

use App\Models\Marketing\MetaSetting;

class SaveMetaAppService
{
    public function execute(string $appId, ?string $appSecret): MetaSetting
    {
        $setting = MetaSetting::current();

        $setting->app_id = $appId;
        if (filled($appSecret)) {
            $setting->app_secret = $appSecret;
        }

        // Changing the app invalidates any token issued by the previous one.
        if ($setting->isDirty(['app_id', 'app_secret'])) {
            $setting->fill([
                'access_token' => null,
                'token_expires_at' => null,
                'ad_account_id' => null,
                'ad_account_name' => null,
                'currency' => null,
            ]);
        }

        $setting->save();

        return $setting;
    }
}
