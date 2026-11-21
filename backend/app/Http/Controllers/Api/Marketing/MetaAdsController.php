<?php

namespace App\Http\Controllers\Api\Marketing;

use App\Data\Marketing\MetaSpendData;
use App\Data\Marketing\SaveMetaAppData;
use App\Http\Controllers\Controller;
use App\Models\Catalog\Product;
use App\Models\Marketing\MetaCampaign;
use App\Models\Marketing\MetaSetting;
use App\Services\Meta\BuildMetaAuthUrlService;
use App\Services\Meta\ExchangeMetaCodeService;
use App\Services\Meta\GetCampaignSpendService;
use App\Services\Meta\MetaApiException;
use App\Services\Meta\MetaGraphClient;
use App\Services\Meta\SaveMetaAppService;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MetaAdsController extends Controller
{
    public function __construct(private readonly MetaGraphClient $graph) {}

    public function connection(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->connectionPayload(MetaSetting::current())]);
    }

    public function saveApp(SaveMetaAppData $data, SaveMetaAppService $service): JsonResponse
    {
        $setting = $service->execute($data->app_id, $data->app_secret);

        return response()->json(['data' => $this->connectionPayload($setting)]);
    }

    public function connect(Request $request, BuildMetaAuthUrlService $service): JsonResponse
    {
        $data = $request->validate(['redirect_uri' => ['required', 'url']]);

        return $this->guard(fn () => response()->json(['data' => ['url' => $service->execute($data['redirect_uri'])]]));
    }

    public function callback(Request $request, ExchangeMetaCodeService $service): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'string'], 'state' => ['required', 'string']]);

        return $this->guard(fn () => response()->json([
            'data' => $this->connectionPayload($service->execute($data['code'], $data['state'])),
        ]));
    }

    public function selectAdAccount(Request $request): JsonResponse
    {
        $data = $request->validate(['ad_account_id' => ['required', 'string']]);

        $setting = MetaSetting::current();

        return $this->guard(function () use ($setting, $data) {
            $account = collect($this->adAccounts($setting))->firstWhere('id', $data['ad_account_id']);

            if (! $account) {
                throw ValidationException::withMessages(['ad_account_id' => 'Compte publicitaire introuvable.']);
            }

            $setting->update([
                'ad_account_id' => $account['id'],
                'ad_account_name' => $account['name'] ?? null,
                'currency' => $account['currency'] ?? null,
            ]);

            return response()->json(['data' => $this->connectionPayload($setting)]);
        });
    }

    public function test(Request $request): JsonResponse
    {
        $setting = MetaSetting::current();

        return $this->guard(function () use ($setting) {
            if (! $setting->isConnected()) {
                throw new MetaApiException('Aucune connexion Meta active.');
            }

            $me = $this->graph->get('/me', ['access_token' => $setting->access_token, 'fields' => 'id,name']);

            return response()->json(['data' => ['ok' => true, 'name' => $me['name'] ?? null]]);
        });
    }

    public function disconnect(Request $request): JsonResponse
    {
        MetaSetting::current()->update([
            'access_token' => null,
            'token_expires_at' => null,
            'ad_account_id' => null,
            'ad_account_name' => null,
            'currency' => null,
        ]);

        return response()->json(['data' => $this->connectionPayload(MetaSetting::current())]);
    }

    public function spend(MetaSpendData $data, GetCampaignSpendService $service): JsonResponse
    {
        $campaigns = $this->guard(fn () => $service->execute(
            CarbonImmutable::parse($data->date_from),
            CarbonImmutable::parse($data->date_to),
            $data->fresh,
        ));

        if ($campaigns instanceof JsonResponse) {
            return $campaigns;
        }

        $rate = (float) config('ads.usd_to_dzd_rate');
        $links = MetaCampaign::query()->whereIn('meta_campaign_id', array_column($campaigns, 'id'))->pluck('product_id', 'meta_campaign_id');
        $productNames = Product::query()->whereIn('id', $links->filter()->unique())->pluck('name', 'id');

        $campaignRows = array_map(fn (array $c) => [
            'id' => $c['id'],
            'name' => $c['name'],
            'usd' => round($c['spend'], 2),
            'dzd' => round($c['spend'] * $rate, 2),
            'product_id' => $links[$c['id']] ?? null,
        ], $campaigns);

        $products = collect($campaignRows)
            ->filter(fn (array $c) => $c['product_id'] !== null)
            ->groupBy('product_id')
            ->map(fn ($rows, $productId) => [
                'product_id' => (int) $productId,
                'name' => $productNames[$productId] ?? '—',
                'usd' => round($rows->sum('usd'), 2),
                'dzd' => round($rows->sum('dzd'), 2),
            ])
            ->values();

        $total = round(array_sum(array_column($campaignRows, 'dzd')), 2);
        $linked = round((float) $products->sum('dzd'), 2);

        return response()->json(['data' => [
            'rate' => $rate,
            'total_dzd' => $total,
            'linked_dzd' => $linked,
            'unlinked_dzd' => round($total - $linked, 2),
            'products' => $products,
            'campaigns' => $campaignRows,
        ]]);
    }

    public function linkCampaign(Request $request, string $campaignId): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ]);

        MetaCampaign::query()->updateOrCreate(
            ['meta_campaign_id' => $campaignId],
            ['name' => $data['name'], 'product_id' => $data['product_id'] ?? null],
        );

        return response()->json(['data' => ['id' => $campaignId, 'product_id' => $data['product_id'] ?? null]]);
    }

    /** Turns Meta failures into a 422 JSON error instead of a 500. */
    private function guard(callable $callback): mixed
    {
        try {
            return $callback();
        } catch (MetaApiException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /** @return list<array<string, mixed>> */
    private function adAccounts(MetaSetting $setting): array
    {
        return $this->graph->getAll('/me/adaccounts', [
            'access_token' => $setting->access_token,
            'fields' => 'id,name,currency',
            'limit' => 50,
        ]);
    }

    /** @return array<string, mixed> */
    private function connectionPayload(MetaSetting $setting): array
    {
        $accounts = [];

        if ($setting->isConnected()) {
            try {
                $accounts = $this->adAccounts($setting);
            } catch (MetaApiException) {
                // Listing is best-effort; status must still render.
            }
        }

        return [
            'app_id' => $setting->app_id,
            'has_secret' => filled($setting->app_secret),
            'connected' => $setting->isConnected(),
            'expired' => filled($setting->access_token) && ! $setting->isConnected(),
            'expires_at' => $setting->token_expires_at?->toIso8601String(),
            'ad_account' => $setting->ad_account_id ? [
                'id' => $setting->ad_account_id,
                'name' => $setting->ad_account_name,
                'currency' => $setting->currency,
            ] : null,
            'ad_accounts' => $accounts,
            'rate' => (float) config('ads.usd_to_dzd_rate'),
        ];
    }
}
