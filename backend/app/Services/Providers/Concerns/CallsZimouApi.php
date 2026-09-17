<?php

namespace App\Services\Providers\Concerns;

use App\Models\DeliveryCompanyIntegration;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

trait CallsZimouApi
{
    protected function zimouRequest(): PendingRequest
    {
        return Http::baseUrl(config('services.zimou.base_url'))
            ->withToken($this->apiToken())
            ->acceptJson();
    }

    private function apiToken(): string
    {
        $token = DeliveryCompanyIntegration::where('company_key', 'zimou')->first()?->api_token;

        if (! $token) {
            throw new RuntimeException("Aucun jeton d'API configuré pour Zimou Express.");
        }

        return $token;
    }
}
