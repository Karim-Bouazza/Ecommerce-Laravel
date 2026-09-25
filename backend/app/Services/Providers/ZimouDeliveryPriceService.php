<?php

namespace App\Services\Providers;

use App\Enums\DeliveryType;
use App\Services\Providers\Concerns\CallsZimouApi;
use Illuminate\Support\Facades\Cache;

class ZimouDeliveryPriceService
{
    use CallsZimouApi;

    public function fetchHomeDeliveryPrice(int $providerWilayaId, ?int $providerCommuneId = null): ?int
    {
        $prices = $this->fetchHomeDeliveryPrices($providerWilayaId);

        if ($prices === []) {
            return null;
        }

        if ($providerCommuneId !== null) {
            $match = collect($prices)->firstWhere('commune_id', $providerCommuneId);

            if ($match !== null) {
                return $match['delivery_price'];
            }
        }

        return $prices[0]['delivery_price'];
    }

    /**
     * @return array<int, array{commune_id: int, delivery_price: int}>
     */
    private function fetchHomeDeliveryPrices(int $providerWilayaId): array
    {
        return Cache::remember(
            "zimou:delivery-price:home:{$providerWilayaId}",
            now()->addDay(),
            function () use ($providerWilayaId) {
                $response = $this->zimouRequest()
                    ->get('/store-delivery-types', [
                        'filter' => [
                            'wilaya_id' => $providerWilayaId,
                            'delivery_type_name' => DeliveryType::Express->label(),
                        ],
                    ])
                    ->throw();

                $prices = collect($response->json('data', []))->first()['prices'] ?? [];

                return collect($prices)
                    ->map(fn (array $entry) => [
                        'commune_id' => (int) $entry['commune_id'],
                        'delivery_price' => (int) $entry['delivery_price'],
                    ])
                    ->values()
                    ->all();
            }
        );
    }
}
