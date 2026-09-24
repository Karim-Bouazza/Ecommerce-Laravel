<?php

namespace App\Http\Resources;

use App\Support\Analytics\OrderRateCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WilayaAnalyticsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalOrdersCount = (int) $this->total_orders_count;
        $confirmedCount = (int) $this->confirmed_count;
        $deliveredCount = (int) $this->delivered_count;
        $returnedCount = (int) $this->returned_count;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'nombre_commandes' => [
                'count' => $totalOrdersCount,
                'percentage' => OrderRateCalculator::percentage($totalOrdersCount, (int) $this->grand_total_orders_count),
            ],
            'commandes_confirmees' => [
                'count' => $confirmedCount,
                'percentage' => OrderRateCalculator::percentage($confirmedCount, (int) $this->grand_confirmed_count),
            ],
            'commandes_livrees' => [
                'count' => $deliveredCount,
                'percentage' => OrderRateCalculator::percentage($deliveredCount, (int) $this->grand_delivered_count),
            ],
            'commandes_retournees' => [
                'count' => $returnedCount,
                'percentage' => OrderRateCalculator::percentage($returnedCount, (int) $this->grand_returned_count),
            ],
            'taux_confirmation' => OrderRateCalculator::confirmationRate(
                (int) $this->confirmed_or_later_count,
                $totalOrdersCount,
            ),
            'performance_confirmation' => OrderRateCalculator::confirmationPerformance(
                (int) $this->confirmed_or_later_count,
                $totalOrdersCount,
                (int) $this->pending_count,
            ),
            'taux_livraison' => OrderRateCalculator::deliveryRate($deliveredCount, $totalOrdersCount),
            'performance_livraison' => OrderRateCalculator::deliveryPerformance(
                $deliveredCount,
                (int) $this->delivery_resolved_count,
            ),
        ];
    }
}
