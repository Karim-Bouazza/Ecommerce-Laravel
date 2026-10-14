<?php

namespace App\Services\Partners;

use App\Models\Delivery\DeliveryCompanyIntegration;

class DeleteDeliveryCompanyIntegrationService
{
    public function execute(string $companyKey): void
    {
        DeliveryCompanyIntegration::where('company_key', $companyKey)->delete();
    }
}
