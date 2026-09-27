<?php

namespace App\Services\Providers;

use App\Models\Communes;
use App\Services\Providers\Concerns\CallsZimouApi;
use Illuminate\Support\Facades\Cache;

class ZimouCommuneService
{
    use CallsZimouApi;

    /**
     * @return array<int, array{id: int, name: string, name_ar: string|null}>
     */
    public function fetchCommunes(int $providerWilayaId): array
    {
        return Cache::remember("zimou:communes:v2:{$providerWilayaId}", now()->addDay(), function () use ($providerWilayaId) {
            $response = $this->zimouRequest()
                ->get('/helpers/communes', ['filter' => ['wilaya_id' => $providerWilayaId]])
                ->throw();

            return collect($response->json('data', []))
                ->map(fn (array $commune) => [
                    'id' => (int) $commune['id'],
                    'name' => (string) $commune['name'],
                    'name_ar' => Communes::where('provider_id', (int) $commune['id'])->value('ar_name'),
                ])
                ->values()
                ->all();
        });
    }
}
