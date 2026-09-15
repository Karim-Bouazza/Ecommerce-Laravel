<?php

namespace App\Services\Partners;

use App\Models\DeliveryCompanyIntegration;
use App\Support\DeliveryCompanyIntegrationRegistry;

class SaveDeliveryCompanyIntegrationService
{
    /**
     * @param  array{name: string, api_token: string}  $data
     */
    public function execute(string $companyKey, array $data): DeliveryCompanyIntegration
    {
        $company = DeliveryCompanyIntegrationRegistry::get($companyKey);

        return DeliveryCompanyIntegration::updateOrCreate(
            ['company_key' => $companyKey],
            [
                'name' => $data['name'],
                'api_token' => $data['api_token'],
                'base_url' => $company['base_url'],
            ]
        );
    }
}
