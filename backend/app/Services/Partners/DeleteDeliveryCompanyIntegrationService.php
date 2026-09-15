<?php

namespace App\Services\Partners;

use App\Models\DeliveryCompanyIntegration;

class DeleteDeliveryCompanyIntegrationService
{
    public function execute(string $companyKey): void
    {
        DeliveryCompanyIntegration::where('company_key', $companyKey)->delete();
    }
}
