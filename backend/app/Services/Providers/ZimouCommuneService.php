<?php

namespace App\Services\Providers;

use App\Services\Providers\Concerns\CallsZimouApi;
use Illuminate\Support\Facades\Cache;

class ZimouCommuneService
{
    use CallsZimouApi;

    /**
     * @return array<int, array{id: int, name: string}>
     */
    public function fetchCommunes(int $providerWilayaId): array
    {
        return Cache::remember("zimou:communes:{$providerWilayaId}", now()->addDay(), function () use ($providerWilayaId) {
            $response = $this->zimouRequest()
                ->get('/helpers/communes', ['filter' => ['wilaya_id' => $providerWilayaId]])
                ->throw();

            return collect($response->json('data', []))
                ->map(fn (array $commune) => [
                    'id' => (int) $commune['id'],
                    'name' => (string) $commune['name'],
                ])
                ->values()
                ->all();
        });
    }
}
