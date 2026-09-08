<?php

namespace App\Filament\Pages;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use BackedEnum;
use Carbon\CarbonPeriod;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PerformanceKpi extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPresentationChartLine;

    protected static ?string $navigationLabel = 'Performance (KPI)';

    protected static ?string $title = 'Performance (KPI)';

    protected static ?string $slug = 'performance-kpi';

    protected static ?int $navigationSort = -1;

    protected string $view = 'filament.pages.performance-kpi';

    public string $period = 'all';

    public string $evolutionMode = 'montant';

    /**
     * @return array<string, string>
     */
    public function getPeriods(): array
    {
        return [
            'all' => 'Tout le temps',
            'today' => "Aujourd'hui",
            'yesterday' => 'Hier',
            'last_week' => 'La semaine dernière',
            'last_month' => 'Le mois dernier',
        ];
    }

    public function setPeriod(string $period): void
    {
        $this->period = array_key_exists($period, $this->getPeriods()) ? $period : 'all';
    }

    public function setEvolutionMode(string $mode): void
    {
        $this->evolutionMode = in_array($mode, ['montant', 'capital'], true) ? $mode : 'montant';
    }

    /**
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    protected function getPeriodRange(): array
    {
        return match ($this->period) {
            'today' => [Carbon::today(), Carbon::today()->endOfDay()],
            'yesterday' => [Carbon::yesterday(), Carbon::yesterday()->endOfDay()],
            'last_week' => [Carbon::now()->subWeek()->startOfWeek(), Carbon::now()->subWeek()->endOfWeek()],
            'last_month' => [Carbon::now()->subMonthNoOverflow()->startOfMonth(), Carbon::now()->subMonthNoOverflow()->endOfMonth()],
            default => [null, null],
        };
    }

    protected function ordersInRange(?Carbon $from, ?Carbon $until): Builder
    {
        return Order::query()
            ->when($from, fn (Builder $query) => $query->where('created_at', '>=', $from))
            ->when($until, fn (Builder $query) => $query->where('created_at', '<=', $until));
    }

    protected function money(float $value): string
    {
        return number_format($value, 0, ',', ' ');
    }

    /**
     * @return array<string, ?string>
     */
    public function getRevenueProfit(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $ventes = (float) $this->ordersInRange($from, $until)->sum('subtotal');

        $revenus = (float) $this->ordersInRange($from, $until)
            ->where('status', OrderStatus::Delivered)
            ->sum('subtotal');

        $capital = (float) Wallet::query()->sum('balance');

        return [
            'ventes' => $this->money($ventes),
            'revenus' => $this->money($revenus),
            'benefices' => null,
            'roi' => null,
            'upsell' => null,
            'capital' => $this->money($capital),
        ];
    }

    /**
     * @return array<string, ?string>
     */
    public function getExpenses(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $fraisLivraison = (float) $this->ordersInRange($from, $until)->sum('delivery_price');

        $coutProduits = (float) OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->when($from, fn (Builder $q) => $q->where('orders.created_at', '>=', $from))
            ->when($until, fn (Builder $q) => $q->where('orders.created_at', '<=', $until))
            ->sum(DB::raw('order_items.quantity * products.purchase_price'));

        return [
            'charges' => null,
            'fraisLivraison' => $this->money($fraisLivraison),
            'fraisRetour' => null,
            'coutProduits' => $this->money($coutProduits),
            'ventesMarketers' => null,
            'fraisAgent' => null,
        ];
    }

    /**
     * @return array{tauxConfirmation: float, tauxLivraison: float}
     */
    public function getKpiRates(): array
    {
        [$from, $until] = $this->getPeriodRange();
        $query = $this->ordersInRange($from, $until);

        $total = (clone $query)->count();
        $confirmed = (clone $query)->where('status', OrderStatus::Confirmed)->count();
        $delivered = (clone $query)->where('status', OrderStatus::Delivered)->count();

        return [
            'tauxConfirmation' => $total > 0 ? round(($confirmed / $total) * 100, 1) : 0.0,
            'tauxLivraison' => $total > 0 ? round(($delivered / $total) * 100, 1) : 0.0,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getClientMetrics(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $ordersQuery = $this->ordersInRange($from, $until)->whereNotNull('client_id');

        $ordersCount = (clone $ordersQuery)->count();
        $ventes = (float) (clone $ordersQuery)->sum('subtotal');

        $clientOrderCounts = (clone $ordersQuery)
            ->selectRaw('client_id, COUNT(*) as cnt')
            ->groupBy('client_id')
            ->pluck('cnt', 'client_id');

        $acheteurs = $clientOrderCounts->count();
        $newClients = 0;

        if ($acheteurs > 0) {
            $firstOrderDates = Order::query()
                ->whereIn('client_id', $clientOrderCounts->keys())
                ->groupBy('client_id')
                ->selectRaw('client_id, MIN(created_at) as first_at')
                ->pluck('first_at', 'client_id');

            $newClients = $firstOrderDates
                ->filter(fn ($firstAt) => $from === null || Carbon::parse($firstAt)->greaterThanOrEqualTo($from))
                ->count();
        }

        $tauxAcquisition = $acheteurs > 0 ? round(($newClients / $acheteurs) * 100, 1) : 0.0;
        $tauxRetention = $acheteurs > 0 ? round((($acheteurs - $newClients) / $acheteurs) * 100, 1) : 0.0;

        return [
            'acheteurs' => number_format($acheteurs, 0, ',', ' '),
            'tauxAcquisition' => $tauxAcquisition,
            'tauxRetention' => $tauxRetention,
            'aov' => $this->money($ordersCount > 0 ? $ventes / $ordersCount : 0),
            'pov' => null,
            'acv' => $this->money($acheteurs > 0 ? $ventes / $acheteurs : 0),
            'pcv' => null,
        ];
    }

    /**
     * @return array{labels: array<int, string>, ventes: array<int, float>, capital: array<int, float>}
     */
    public function getSalesEvolution(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $start = $from ? $from->copy()->startOfDay() : Carbon::today()->subDays(29);
        $end = $until ? $until->copy()->endOfDay() : Carbon::today()->endOfDay();

        $salesByDay = Order::query()
            ->where('created_at', '>=', $start)
            ->where('created_at', '<=', $end)
            ->selectRaw('DATE(created_at) as day, SUM(subtotal) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $openingCapital = (float) (WalletTransaction::query()
            ->where('date', '<', $start->toDateString())
            ->selectRaw("SUM(CASE WHEN type = 'in' THEN amount ELSE -amount END) as balance")
            ->value('balance') ?? 0);

        $capitalByDay = WalletTransaction::query()
            ->where('date', '>=', $start->toDateString())
            ->where('date', '<=', $end->toDateString())
            ->selectRaw("date, SUM(CASE WHEN type = 'in' THEN amount ELSE -amount END) as delta")
            ->groupBy('date')
            ->pluck('delta', 'date');

        $labels = [];
        $ventes = [];
        $capital = [];
        $running = $openingCapital;

        foreach (CarbonPeriod::create($start, $end) as $day) {
            $key = $day->toDateString();
            $labels[] = $day->format('d/m');
            $ventes[] = (float) ($salesByDay[$key] ?? 0);
            $running += (float) ($capitalByDay[$key] ?? 0);
            $capital[] = $running;
        }

        return [
            'labels' => $labels,
            'ventes' => $ventes,
            'capital' => $capital,
        ];
    }
}
