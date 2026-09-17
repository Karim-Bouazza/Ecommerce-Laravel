<?php

namespace App\Services\Providers;

use App\Services\Providers\Concerns\CallsZimouApi;
use Illuminate\Support\Facades\Cache;

class ZimouStopDeskService
{
    use CallsZimouApi;

    /**
     * @return array<int, array{office_id: string, name: string, address: string|null, price: int}>
     */
    public function fetchStopDesks(int $providerWilayaId, int $providerCommuneId): array
    {
        return Cache::remember(
            "zimou:stopdesks:{$providerWilayaId}:{$providerCommuneId}",
            now()->addHour(),
            function () use ($providerWilayaId, $providerCommuneId) {
                $response = $this->zimouRequest()
                    ->get('/store-stopdesks', [
                        'filter' => [
                            'wilaya_id' => $providerWilayaId,
                            'commune_id' => $providerCommuneId,
                        ],
                    ])
                    ->throw();

                return collect($response->json('data', []))
                    ->map(fn (array $office) => [
                        'office_id' => (string) $office['office_id'],
                        'name' => (string) $office['partner_company_name'],
                        'address' => $office['address'] ?? null,
                        'price' => (int) $office['price'],
                    ])
                    ->values()
                    ->all();
            }
        );
    }
}
