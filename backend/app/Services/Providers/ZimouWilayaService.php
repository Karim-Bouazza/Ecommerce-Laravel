<?php

namespace App\Services\Providers;

use App\Models\Wilaya;
use App\Services\Providers\Concerns\CallsZimouApi;
use Illuminate\Support\Facades\Cache;

class ZimouWilayaService
{
    use CallsZimouApi;

    /**
     * @return array<int, array{id: int, name: string}>
     */
    public function fetchWilayas(): array
    {
        return Cache::remember('zimou:wilayas', now()->addDay(), function () {
            $response = $this->zimouRequest()
                ->get('/helpers/wilayas')
                ->throw();

            return collect($response->json('data', []))
                ->map(fn (array $wilaya) => [
                    'id' => (int) $wilaya['id'],
                    'name' => (string) $wilaya['name'],
                ])
                ->values()
                ->all();
        });
    }

    /**
     * @return array<int, array{id: int, name: string, wilaya_id: int|null}>
     */
    public function listWithLocalMatch(): array
    {
        return collect($this->fetchWilayas())
            ->map(fn (array $wilaya) => [
                ...$wilaya,
                'wilaya_id' => $this->matchLocalWilayaId($wilaya['name']),
            ])
            ->all();
    }

    private function matchLocalWilayaId(string $name): ?int
    {
        return Wilaya::whereRaw('LOWER(name) = ?', [mb_strtolower(trim($name))])->value('id');
    }
}
