<?php

namespace App\Services\Meta;

use App\Models\Marketing\MetaCampaign;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Log;

class GetProductAdSpendService
{
    public function __construct(private readonly GetCampaignSpendService $campaignSpend) {}

    /**
     * Ad spend in DZD per product id (campaign USD × configured rate).
     * Never throws: analytics must keep working if Meta is down/disconnected.
     *
     * @return array<int, float>
     */
    public function execute(?CarbonInterface $from, ?CarbonInterface $to): array
    {
        try {
            $campaigns = $this->campaignSpend->execute($from, $to);
        } catch (MetaApiException $e) {
            Log::warning('Meta spend fetch failed', ['message' => $e->getMessage()]);

            return [];
        }

        if ($campaigns === []) {
            return [];
        }

        $productByCampaign = MetaCampaign::query()
            ->whereIn('meta_campaign_id', array_column($campaigns, 'id'))
            ->whereNotNull('product_id')
            ->pluck('product_id', 'meta_campaign_id');

        $rate = (float) config('ads.usd_to_dzd_rate');
        $result = [];

        foreach ($campaigns as $campaign) {
            $productId = $productByCampaign[$campaign['id']] ?? null;
            if ($productId !== null) {
                $result[$productId] = ($result[$productId] ?? 0.0) + $campaign['spend'] * $rate;
            }
        }

        return $result;
    }
}
