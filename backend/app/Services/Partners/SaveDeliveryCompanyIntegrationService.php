<?php

namespace App\Services\Partners;

use App\Data\Delivery\SaveDeliveryCompanyIntegrationData;
use App\Models\Delivery\DeliveryCompanyIntegration;
use App\Support\DeliveryCompanyIntegrationRegistry;

class SaveDeliveryCompanyIntegrationService
{
    public function execute(string $companyKey, SaveDeliveryCompanyIntegrationData $data): DeliveryCompanyIntegration
    {
        $company = DeliveryCompanyIntegrationRegistry::get($companyKey);

        return DeliveryCompanyIntegration::updateOrCreate(
            ['company_key' => $companyKey],
            [
                'name' => $data->name,
                'api_token' => $data->api_token,
                'base_url' => $company['base_url'],
            ]
        );
    }
}
