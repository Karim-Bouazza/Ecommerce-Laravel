<?php

namespace App\Services\Meta;

use App\Models\Marketing\MetaSetting;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Cache;

class GetCampaignSpendService
{
    public function __construct(private readonly MetaGraphClient $graph) {}

    /**
     * Live spend per campaign (ad account currency, USD expected) for the period.
     * Only a 5-minute cache protects the Graph API rate limit; nothing is persisted.
     *
     * @return list<array{id: string, name: string, spend: float}>
     */
    public function execute(?CarbonInterface $from, ?CarbonInterface $to, bool $fresh = false): array
    {
        $setting = MetaSetting::current();

        if (! $setting->isConnected() || ! $setting->ad_account_id) {
            return [];
        }

        $since = ($from ?? now()->startOfMonth())->toDateString();
        $until = ($to ?? now())->toDateString();
        $key = "meta:spend:{$setting->ad_account_id}:{$since}:{$until}";

        if ($fresh) {
            Cache::forget($key);
        }

        return Cache::remember($key, now()->addMinutes(5), fn () => $this->fetch($setting, $since, $until));
    }

    /** @return list<array{id: string, name: string, spend: float}> */
    private function fetch(MetaSetting $setting, string $since, string $until): array
    {
        $rows = $this->graph->getAll("/{$setting->ad_account_id}/insights", [
            'access_token' => $setting->access_token,
            'level' => 'campaign',
            'fields' => 'campaign_id,campaign_name,spend',
            'time_range' => json_encode(['since' => $since, 'until' => $until]),
            'limit' => 200,
        ]);

        return collect($rows)
            ->map(fn (array $r) => [
                'id' => (string) $r['campaign_id'],
                'name' => (string) ($r['campaign_name'] ?? $r['campaign_id']),
                'spend' => (float) ($r['spend'] ?? 0),
            ])
            ->filter(fn (array $c) => $c['spend'] > 0)
            ->values()
            ->all();
    }
}
