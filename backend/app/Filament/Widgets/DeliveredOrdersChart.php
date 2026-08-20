<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Filament\Widgets\Concerns\InteractsWithDashboardPeriod;
use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Carbon\CarbonPeriod;
use Illuminate\Support\Carbon;

class DeliveredOrdersChart extends ChartWidget
{
    use InteractsWithDashboardPeriod;

    protected ?string $heading = 'Sales Overview';

    protected int | string | array $columnSpan = 'full';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'min' => 0,
                    'suggestedMax' => 20,
                    'ticks' => [
                        'stepSize' => 1,
                    ],
                ],
            ],
        ];
    }

    protected function getData(): array
    {
        [$from, $until] = $this->getPeriodRange();

        $deliveredDates = Order::query()
            ->where('status', OrderStatus::Delivered)
            ->when($from, fn ($query) => $query->whereDate('created_at', '>=', $from))
            ->when($until, fn ($query) => $query->whereDate('created_at', '<=', $until))
            ->pluck('created_at');

        [$labels, $counts] = match ($this->getPeriod()) {
            'year' => $this->groupByMonth($deliveredDates),
            'today' => $this->groupByHour($deliveredDates),
            default => $this->groupByDay($deliveredDates, $from, $until),
        };

        return [
            'datasets' => [
                [
                    'label' => 'Commandes livrées',
                    'data' => $counts,
                ],
            ],
            'labels' => $labels,
        ];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Carbon>  $dates
     * @return array{0: array<int, string>, 1: array<int, int>}
     */
    protected function groupByMonth($dates): array
    {
        $monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        $counts = array_fill(0, 12, 0);

        foreach ($dates as $date) {
            $counts[Carbon::parse($date)->month - 1]++;
        }

        return [$monthLabels, $counts];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Carbon>  $dates
     * @return array{0: array<int, string>, 1: array<int, int>}
     */
    protected function groupByHour($dates): array
    {
        $hourLabels = collect(range(0, 23))->map(fn (int $hour) => sprintf('%02dh', $hour))->all();
        $counts = array_fill(0, 24, 0);

        foreach ($dates as $date) {
            $counts[Carbon::parse($date)->hour]++;
        }

        return [$hourLabels, $counts];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Carbon>  $dates
     * @return array{0: array<int, string>, 1: array<int, int>}
     */
    protected function groupByDay($dates, ?Carbon $from, ?Carbon $until): array
    {
        $countsByDay = $dates
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->countBy();

        $start = $from ?? ($countsByDay->keys()->min() ? Carbon::parse($countsByDay->keys()->min()) : Carbon::today());
        $end = $until ?? ($countsByDay->keys()->max() ? Carbon::parse($countsByDay->keys()->max()) : Carbon::today());

        $labels = [];
        $counts = [];

        foreach (CarbonPeriod::create($start, $end) as $day) {
            $labels[] = $day->format('d/m');
            $counts[] = $countsByDay->get($day->toDateString(), 0);
        }

        return [$labels, $counts];
    }
}
