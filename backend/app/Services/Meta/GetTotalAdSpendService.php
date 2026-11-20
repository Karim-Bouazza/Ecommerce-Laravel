<?php

namespace App\Services\Meta;

use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Log;

class GetTotalAdSpendService
{
    private const MAX_HISTORY_MONTHS = 36;

    public function __construct(private readonly GetCampaignSpendService $campaignSpend) {}

    public function execute(?CarbonInterface $from, ?CarbonInterface $to): float
    {
        try {
            $campaigns = $this->campaignSpend->execute(
                $from ?? now()->subMonths(self::MAX_HISTORY_MONTHS)->startOfMonth(),
                $to ?? now(),
            );
        } catch (MetaApiException $e) {
            Log::warning('Meta spend fetch failed', ['message' => $e->getMessage()]);

            return 0.0;
        }

        return round(array_sum(array_column($campaigns, 'spend')) * (float) config('ads.usd_to_dzd_rate'), 2);
    }
}
