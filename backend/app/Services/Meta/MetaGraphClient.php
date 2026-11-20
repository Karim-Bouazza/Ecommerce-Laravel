<?php

namespace App\Services\Meta;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Throwable;

class MetaGraphClient
{
    private function http(): PendingRequest
    {
        $version = config('services.meta.graph_version', 'v21.0');

        return Http::baseUrl("https://graph.facebook.com/{$version}")->timeout(20)->acceptJson();
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<string, mixed>
     */
    public function get(string $path, array $query = []): array
    {
        try {
            $response = $this->http()->get($path, $query);
        } catch (Throwable $e) {
            throw new MetaApiException('Impossible de joindre Meta.', 0, $e);
        }

        if ($response->failed()) {
            throw new MetaApiException($response->json('error.message') ?? 'Erreur Meta.', $response->status());
        }

        return $response->json() ?? [];
    }

    /**
     * Follows Graph cursor pagination and returns all rows.
     *
     * @param  array<string, mixed>  $query
     * @return list<array<string, mixed>>
     */
    public function getAll(string $path, array $query = [], int $maxPages = 10): array
    {
        $rows = [];
        $page = $this->get($path, $query);

        for ($i = 1; ; $i++) {
            $rows = [...$rows, ...($page['data'] ?? [])];
            $after = $page['paging']['cursors']['after'] ?? null;

            if (! isset($page['paging']['next']) || $after === null || $i >= $maxPages) {
                return $rows;
            }

            $page = $this->get($path, [...$query, 'after' => $after]);
        }
    }
}
