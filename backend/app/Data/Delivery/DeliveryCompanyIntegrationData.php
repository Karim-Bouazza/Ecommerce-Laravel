<?php

namespace App\Data\Delivery;

use App\Models\Delivery\DeliveryCompanyIntegration;
use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;

class DeliveryCompanyIntegrationData extends Data
{
    public function __construct(
        public string $company_key,
        public string $name,
        public ?string $base_url,
        public bool $has_token,
        public ?CarbonInterface $updated_at,
    ) {}

    public static function fromIntegration(DeliveryCompanyIntegration $integration): self
    {
        return new self(
            company_key: $integration->company_key,
            name: $integration->name,
            base_url: $integration->base_url,
            has_token: filled($integration->api_token),
            updated_at: $integration->updated_at,
        );
    }

    public static function unconfigured(string $companyKey, array $company): self
    {
        return new self(
            company_key: $companyKey,
            name: $company['name'],
            base_url: $company['base_url'],
            has_token: false,
            updated_at: null,
        );
    }
}
