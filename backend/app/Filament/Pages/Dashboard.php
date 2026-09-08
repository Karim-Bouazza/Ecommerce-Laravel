<?php

namespace App\Filament\Pages;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use Filament\Pages\Dashboard as BaseDashboard;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class Dashboard extends BaseDashboard
{
    protected string $view = 'filament.pages.dashboard';

    protected static ?string $title = 'Dashboard';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasPermission('dashboard.view') ?? false;
    }

    public string $period = 'all';

    public string $mode = 'numbers';

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

    public function setMode(string $mode): void
    {
        $this->mode = in_array($mode, ['numbers', 'percentage'], true) ? $mode : 'numbers';
    }

    public function getWidgets(): array
    {
        return [];
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

    /**
     * @return array{0: ?Carbon, 1: ?Carbon}
     */
    protected function getPreviousPeriodRange(): array
    {
        return match ($this->period) {
            'today' => [Carbon::yesterday(), Carbon::yesterday()->endOfDay()],
            'yesterday' => [Carbon::today()->subDays(2), Carbon::today()->subDays(2)->endOfDay()],
            'last_week' => [Carbon::now()->subWeeks(2)->startOfWeek(), Carbon::now()->subWeeks(2)->endOfWeek()],
            'last_month' => [Carbon::now()->subMonthsNoOverflow(2)->startOfMonth(), Carbon::now()->subMonthsNoOverflow(2)->endOfMonth()],
            default => [null, null],
        };
    }

    protected function ordersInRange(?Carbon $from, ?Carbon $until): Builder
    {
        return Order::query()
            ->when($from, fn (Builder $query) => $query->where('created_at', '>=', $from))
            ->when($until, fn (Builder $query) => $query->where('created_at', '<=', $until));
    }

    /**
     * @return array{total: int, confirmed: int, delivered: int, sales: float}
     */
    protected function statValues(?Carbon $from, ?Carbon $until): array
    {
        $query = $this->ordersInRange($from, $until);

        return [
            'total' => (clone $query)->count(),
            'confirmed' => (clone $query)->where('status', OrderStatus::Confirmed)->count(),
            'delivered' => (clone $query)->where('status', OrderStatus::Delivered)->count(),
            'sales' => (float) (clone $query)->sum('subtotal'),
        ];
    }

    protected function percentageChange(float $current, float $previous): float
    {
        if ($previous === 0.0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function getStats(): array
    {
        [$from, $until] = $this->getPeriodRange();
        $current = $this->statValues($from, $until);

        $previous = null;

        if ($this->mode === 'percentage' && $this->period !== 'all') {
            [$prevFrom, $prevUntil] = $this->getPreviousPeriodRange();
            $previous = $this->statValues($prevFrom, $prevUntil);
        }

        $definitions = [
            'total' => ['label' => 'Total des commandes', 'icon' => 'cart', 'color' => 'orange'],
            'confirmed' => ['label' => 'Commandes confirmées', 'icon' => 'check', 'color' => 'teal'],
            'delivered' => ['label' => 'Commandes livrées', 'icon' => 'truck', 'color' => 'green'],
            'sales' => ['label' => 'Ventes', 'icon' => 'dollar', 'color' => 'blue', 'suffix' => ' (DZD)', 'isSales' => true],
        ];

        $stats = [];

        foreach ($definitions as $key => $definition) {
            $value = $current[$key];

            $stats[] = [
                'key' => $key,
                'label' => $definition['label'],
                'icon' => $definition['icon'],
                'color' => $definition['color'],
                'value' => number_format($value, 0, ',', ' '),
                'suffix' => $definition['suffix'] ?? '',
                'change' => $previous !== null ? $this->percentageChange($value, $previous[$key]) : null,
            ];
        }

        return $stats;
    }

    /**
     * @return Collection<int, array{label: string, value: string}>
     */
    public function getTopProducts(int $limit = 5): Collection
    {
        [$from, $until] = $this->getPeriodRange();

        return OrderItem::query()
            ->selectRaw('product_id, SUM(quantity) as total_qty')
            ->whereHas('order', function (Builder $query) use ($from, $until) {
                $query
                    ->when($from, fn (Builder $q) => $q->where('created_at', '>=', $from))
                    ->when($until, fn (Builder $q) => $q->where('created_at', '<=', $until));
            })
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->with('product:id,name')
            ->limit($limit)
            ->get()
            ->filter(fn (OrderItem $item) => $item->product !== null)
            ->map(fn (OrderItem $item) => [
                'label' => $item->product->name,
                'value' => number_format((int) $item->total_qty, 0, ',', ' ').' vendus',
            ])
            ->values();
    }

    /**
     * @return Collection<int, array{label: string, value: string}>
     */
    public function getTopWilayas(int $limit = 5): Collection
    {
        [$from, $until] = $this->getPeriodRange();

        return Order::query()
            ->join('clients', 'clients.id', '=', 'orders.client_id')
            ->join('wilayas', 'wilayas.id', '=', 'clients.wilaya_id')
            ->when($from, fn (Builder $q) => $q->where('orders.created_at', '>=', $from))
            ->when($until, fn (Builder $q) => $q->where('orders.created_at', '<=', $until))
            ->groupBy('wilayas.id', 'wilayas.name')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->selectRaw('wilayas.name as label, COUNT(*) as orders_count')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->label,
                'value' => number_format((int) $row->orders_count, 0, ',', ' ').' commandes',
            ]);
    }

    /**
     * @return Collection<int, array{label: string, value: string}>
     */
    public function getTopDeliveryCompanies(int $limit = 5): Collection
    {
        [$from, $until] = $this->getPeriodRange();

        return Order::query()
            ->join('delivery_companies', 'delivery_companies.id', '=', 'orders.stop_desk_company_id')
            ->when($from, fn (Builder $q) => $q->where('orders.created_at', '>=', $from))
            ->when($until, fn (Builder $q) => $q->where('orders.created_at', '<=', $until))
            ->groupBy('delivery_companies.id', 'delivery_companies.name')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->selectRaw('delivery_companies.name as label, COUNT(*) as orders_count')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->label,
                'value' => number_format((int) $row->orders_count, 0, ',', ' ').' commandes',
            ]);
    }

    /**
     * @return Collection<int, array{label: string, value: string}>
     */
    public function getTopClients(int $limit = 5): Collection
    {
        [$from, $until] = $this->getPeriodRange();

        return Order::query()
            ->join('clients', 'clients.id', '=', 'orders.client_id')
            ->when($from, fn (Builder $q) => $q->where('orders.created_at', '>=', $from))
            ->when($until, fn (Builder $q) => $q->where('orders.created_at', '<=', $until))
            ->groupBy('clients.id', 'clients.first_name', 'clients.last_name')
            ->orderByDesc('orders_count')
            ->limit($limit)
            ->selectRaw("CONCAT(clients.first_name, ' ', clients.last_name) as label, COUNT(*) as orders_count")
            ->get()
            ->map(fn ($row) => [
                'label' => $row->label,
                'value' => number_format((int) $row->orders_count, 0, ',', ' ').' commandes',
            ]);
    }
}
