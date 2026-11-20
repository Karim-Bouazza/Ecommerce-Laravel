<?php

namespace App\Services\Meta;

use App\Models\Marketing\MetaSetting;

class ExchangeMetaCodeService
{
    public function __construct(private readonly MetaGraphClient $graph) {}

    public function execute(string $code, string $state): MetaSetting
    {
        $expected = session()->pull('meta_oauth_state');
        $redirectUri = session()->pull('meta_oauth_redirect');

        if (! $expected || ! hash_equals($expected, $state) || ! $redirectUri) {
            throw new MetaApiException('Session de connexion invalide. Réessayez.');
        }

        $setting = MetaSetting::current();

        $short = $this->graph->get('/oauth/access_token', [
            'client_id' => $setting->app_id,
            'client_secret' => $setting->app_secret,
            'redirect_uri' => $redirectUri,
            'code' => $code,
        ]);

        $long = $this->graph->get('/oauth/access_token', [
            'grant_type' => 'fb_exchange_token',
            'client_id' => $setting->app_id,
            'client_secret' => $setting->app_secret,
            'fb_exchange_token' => $short['access_token'],
        ]);

        $setting->access_token = $long['access_token'];
        $setting->token_expires_at = now()->addSeconds((int) ($long['expires_in'] ?? 60 * 24 * 3600));

        // Pre-select the first ad account when none is chosen yet.
        if (! $setting->ad_account_id) {
            $first = ($this->graph->get('/me/adaccounts', [
                'access_token' => $setting->access_token,
                'fields' => 'id,name,currency',
                'limit' => 50,
            ])['data'] ?? [])[0] ?? null;

            if ($first) {
                $setting->ad_account_id = $first['id'];
                $setting->ad_account_name = $first['name'] ?? null;
                $setting->currency = $first['currency'] ?? null;
            }
        }

        $setting->save();

        return $setting;
    }
}
