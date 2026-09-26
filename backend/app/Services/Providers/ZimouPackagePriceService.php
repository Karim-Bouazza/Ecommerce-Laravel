<?php

namespace App\Services\Providers;

use App\Enums\DeliveryType;
use App\Services\Providers\Concerns\CallsZimouApi;

class ZimouPackagePriceService
{
    use CallsZimouApi;

    /**
     * @return array{insurance_value: int, extra_weight_price: int, delivery_price: int, total_price: int, price_to_pay: int}
     */
    public function calculatePrice(
        int $price,
        int $providerWilayaId,
        ?int $providerCommuneId,
        DeliveryType $deliveryType,
        bool $freeDelivery,
        bool $canBeOpened,
        ?string $providerOfficeId = null,
    ): array {
        $payload = [
            'price' => $price,
            'free_delivery' => (int) $freeDelivery,
            'delivery_type_id' => $deliveryType->zimouId(),
            'wilaya_id' => $providerWilayaId,
            'can_be_opened' => (int) $canBeOpened,
            'is_assured' => 0,
        ];

        if ($deliveryType === DeliveryType::Express) {
            $payload['commune_id'] = $providerCommuneId;
        }

        if ($deliveryType === DeliveryType::PointRelais) {
            $payload['office_id'] = $providerOfficeId;
        }

        $response = $this->zimouRequest()
            ->post('/calculate-price-package', $payload)
            ->throw();

        return $response->json();
    }
}
