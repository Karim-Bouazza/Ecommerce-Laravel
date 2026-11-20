<?php

namespace App\Services\Meta;

use App\Models\Marketing\MetaSetting;
use Illuminate\Support\Str;

class BuildMetaAuthUrlService
{
    public function execute(string $redirectUri): string
    {
        $setting = MetaSetting::current();

        if (! $setting->hasApp()) {
            throw new MetaApiException("Renseignez d'abord l'application Meta.");
        }

        $state = Str::random(40);
        session(['meta_oauth_state' => $state, 'meta_oauth_redirect' => $redirectUri]);

        $version = config('services.meta.graph_version', 'v21.0');

        return "https://www.facebook.com/{$version}/dialog/oauth?".http_build_query([
            'client_id' => $setting->app_id,
            'redirect_uri' => $redirectUri,
            'state' => $state,
            'scope' => 'ads_read',
            'response_type' => 'code',
        ]);
    }
}
