<?php

namespace App\Data\Analytics;

use App\Models\Delivery\Wilaya;
use App\Support\Analytics\OrderRateCalculator;
use Spatie\LaravelData\Data;

class WilayaAnalyticsData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public array $nombre_commandes,
        public array $commandes_confirmees,
        public array $commandes_livrees,
        public array $commandes_retournees,
        public mixed $taux_confirmation,
        public mixed $performance_confirmation,
        public mixed $taux_livraison,
        public mixed $performance_livraison,
    ) {}

    public static function fromWilaya(Wilaya $wilaya): self
    {
        $totalOrdersCount = (int) $wilaya->total_orders_count;
        $confirmedCount = (int) $wilaya->confirmed_count;
        $deliveredCount = (int) $wilaya->delivered_count;
        $returnedCount = (int) $wilaya->returned_count;

        return new self(
            id: $wilaya->id,
            name: $wilaya->name,
            nombre_commandes: [
                'count' => $totalOrdersCount,
                'percentage' => OrderRateCalculator::percentage($totalOrdersCount, (int) $wilaya->grand_total_orders_count),
            ],
            commandes_confirmees: [
                'count' => $confirmedCount,
                'percentage' => OrderRateCalculator::percentage($confirmedCount, (int) $wilaya->grand_confirmed_count),
            ],
            commandes_livrees: [
                'count' => $deliveredCount,
                'percentage' => OrderRateCalculator::percentage($deliveredCount, (int) $wilaya->grand_delivered_count),
            ],
            commandes_retournees: [
                'count' => $returnedCount,
                'percentage' => OrderRateCalculator::percentage($returnedCount, (int) $wilaya->grand_returned_count),
            ],
            taux_confirmation: OrderRateCalculator::confirmationRate(
                (int) $wilaya->confirmed_or_later_count,
                $totalOrdersCount,
            ),
            performance_confirmation: OrderRateCalculator::confirmationPerformance(
                (int) $wilaya->confirmed_or_later_count,
                $totalOrdersCount,
                (int) $wilaya->pending_count,
            ),
            taux_livraison: OrderRateCalculator::deliveryRate($deliveredCount, $totalOrdersCount),
            performance_livraison: OrderRateCalculator::deliveryPerformance(
                $deliveredCount,
                (int) $wilaya->delivery_resolved_count,
            ),
        );
    }
}
