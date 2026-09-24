<?php

namespace App\Http\Resources;

use App\Support\Analytics\ProductAnalyticsCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductAnalyticsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $deliveredQuantity = (int) $this->delivered_quantity;
        $sales = (float) $this->delivered_sales_value;
        $cost = ProductAnalyticsCalculator::cost($deliveredQuantity, $this->purchase_price);
        $margin = ProductAnalyticsCalculator::margin($sales, $cost);
        $chargeTotale = (float) ($this->charge_totale ?? 0);
        $beneficeNet = $margin !== null ? $margin - $chargeTotale : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'image' => $this->image_1 ? Storage::url($this->image_1) : null,
            'nombre_commandes' => [
                'count' => (int) $this->total_orders_count,
                'quantity' => (int) $this->total_quantity,
            ],
            'confirme_sans_stock' => [
                'count' => (int) $this->confirmed_no_stock_count,
                'quantity' => (int) $this->confirmed_no_stock_quantity,
            ],
            'commandes_confirmees' => [
                'count' => (int) $this->confirmed_count,
                'quantity' => (int) $this->confirmed_quantity,
            ],
            'commandes_livrees' => [
                'count' => (int) $this->delivered_count,
                'quantity' => $deliveredQuantity,
            ],
            'commandes_retournees' => [
                'count' => (int) $this->returned_count,
                'quantity' => (int) $this->returned_quantity,
            ],
            'taux_confirmation' => ProductAnalyticsCalculator::confirmationRate(
                (int) $this->confirmed_or_later_count,
                (int) $this->total_orders_count,
            ),
            'performance_confirmation' => ProductAnalyticsCalculator::confirmationPerformance(
                (int) $this->confirmed_or_later_count,
                (int) $this->total_orders_count,
                (int) $this->pending_count,
            ),
            'taux_livraison' => ProductAnalyticsCalculator::deliveryRate(
                (int) $this->delivered_count,
                (int) $this->total_orders_count,
            ),
            'performance_livraison' => ProductAnalyticsCalculator::deliveryPerformance(
                (int) $this->delivered_count,
                (int) $this->delivery_resolved_count,
            ),
            'quantite_vendue' => $deliveredQuantity,
            'ventes' => $sales,
            'cout_total_produit' => $cost,
            'marge_brute' => $margin,
            'profit_pourcentage' => ProductAnalyticsCalculator::profitPercentage($margin, $sales),
            'charge_totale' => $chargeTotale,
            'benefice_net' => $beneficeNet,
            'profit_net_pourcentage' => ProductAnalyticsCalculator::profitPercentage($beneficeNet, $sales),
            'moyenne_par_piece' => $deliveredQuantity > 0 ? [
                'charge' => round($chargeTotale / $deliveredQuantity, 2),
                'benefice_net' => $beneficeNet !== null ? round($beneficeNet / $deliveredQuantity, 2) : null,
            ] : null,
        ];
    }
}
