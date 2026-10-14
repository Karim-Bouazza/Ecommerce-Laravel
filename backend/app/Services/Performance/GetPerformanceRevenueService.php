<?php

namespace App\Services\Performance;

use App\Models\Finance\Charge;
use App\Queries\Performance\PerformanceRevenueQuery;
use App\Services\Charges\CalculateChargeAmountService;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Performance\PerformanceFilters;

class GetPerformanceRevenueService
{
    public function __construct(
        private readonly PerformanceRevenueQuery $query,
        private readonly CalculateChargeAmountService $chargeCalculator,
    ) {}

    /**
     * Charges follow the selected period (not the product or warehouse filters,
     * since a charge is a global expense).
     *
     * @return array<string, float>
     */
    public function execute(PerformanceFilters $filters): array
    {
        ['ventes' => $ventes, 'capital' => $capital] = $this->query->deliveredTotals($filters);

        $revenus = $ventes - $capital;

        $charges = Charge::query()
            ->with(['products:id', 'pauses'])
            ->get()
            ->sum(fn (Charge $charge) => $this->chargeCalculator->execute($charge, $filters->from, $filters->to));

        $benefices = $revenus - $charges;

        $customers = $this->query->customerStats($filters);
        $buyers = $customers['buyers'];
        $orders = $customers['delivered_orders'];

        $orderCounts = $this->query->orderCounts($filters);

        return [
            'taux_confirmation' => OrderRateCalculator::confirmationRate($orderCounts['confirmed_or_later'], $orderCounts['total']),
            'taux_livraison' => OrderRateCalculator::deliveryRateOfConfirmed($orderCounts['delivered'], $orderCounts['confirmed_or_later']),
            'performance_confirmation' => OrderRateCalculator::confirmationPerformanceVsCancelled($orderCounts['confirmed_or_later'], $orderCounts['cancelled']),
            'performance_livraison' => OrderRateCalculator::deliveryPerformance($orderCounts['delivered'], $orderCounts['delivery_resolved']),
            'acheteurs' => $buyers,
            'taux_acquisition' => $this->ratio($buyers * 100, $orders),
            'taux_retention' => $this->ratio(($orders - $buyers) * 100, $orders),
            'aov' => $this->ratio($ventes, $orders),
            'pov' => $this->ratio($benefices, $orders),
            'acv' => $this->ratio($ventes, $buyers),
            'pcv' => $this->ratio($benefices, $buyers),
            'ventes' => $ventes,
            'revenus' => $revenus,
            'benefices' => $benefices,
            'benefices_pourcentage' => $ventes > 0 ? round($benefices / $ventes * 100, 2) : 0.0,
            'roi' => $capital > 0 ? round($benefices / $capital * 100, 2) : 0.0,
            'capital' => $capital,
            'charges' => (float) $charges,
            'cout_produits' => $capital,
        ];
    }

    private function ratio(float|int $numerator, float|int $denominator): float
    {
        return $denominator > 0 ? round($numerator / $denominator, 2) : 0.0;
    }
}
