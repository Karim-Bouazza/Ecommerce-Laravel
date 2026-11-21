<?php

namespace App\Data\Analytics;

use App\Models\Catalog\Product;
use App\Support\Analytics\OrderRateCalculator;
use App\Support\Analytics\ProductAnalyticsCalculator;
use Spatie\LaravelData\Data;

class ProductAnalyticsData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $image,
        public array $nombre_commandes,
        public array $confirme_sans_stock,
        public array $commandes_confirmees,
        public array $commandes_livrees,
        public array $commandes_retournees,
        public mixed $taux_confirmation,
        public mixed $performance_confirmation,
        public mixed $taux_livraison,
        public mixed $performance_livraison,
        public int $quantite_vendue,
        public float $ventes,
        public mixed $cout_total_produit,
        public mixed $marge_brute,
        public mixed $profit_pourcentage,
        public float $charge_totale,
        public float $ad_spend,
        public mixed $benefice_net,
        public mixed $profit_net_pourcentage,
        public ?array $moyenne_par_piece,
    ) {}

    public static function fromProduct(Product $product): self
    {
        $deliveredQuantity = (int) $product->delivered_quantity;
        $sales = (float) $product->delivered_sales_value;
        $cost = ProductAnalyticsCalculator::cost($deliveredQuantity, $product->purchase_price);
        $margin = ProductAnalyticsCalculator::margin($sales, $cost);
        $chargeTotale = (float) ($product->charge_totale ?? 0);
        $adSpend = (float) ($product->ad_spend ?? 0);
        $beneficeNet = $margin !== null ? $margin - $chargeTotale - $adSpend : null;

        return new self(
            id: $product->id,
            name: $product->name,
            image: $product->mediaUrl('image_1'),
            nombre_commandes: [
                'count' => (int) $product->total_orders_count,
                'quantity' => (int) $product->total_quantity,
            ],
            confirme_sans_stock: [
                'count' => (int) $product->confirmed_no_stock_count,
                'quantity' => (int) $product->confirmed_no_stock_quantity,
            ],
            commandes_confirmees: [
                'count' => (int) $product->confirmed_count,
                'quantity' => (int) $product->confirmed_quantity,
            ],
            commandes_livrees: [
                'count' => (int) $product->delivered_count,
                'quantity' => $deliveredQuantity,
            ],
            commandes_retournees: [
                'count' => (int) $product->returned_count,
                'quantity' => (int) $product->returned_quantity,
            ],
            taux_confirmation: OrderRateCalculator::confirmationRate(
                (int) $product->confirmed_count,
                (int) $product->total_orders_count,
            ),
            performance_confirmation: OrderRateCalculator::confirmationPerformance(
                (int) $product->confirmed_count,
                (int) $product->total_orders_count,
                (int) $product->pending_count,
            ),
            taux_livraison: OrderRateCalculator::deliveryRate(
                (int) $product->delivered_count,
                (int) $product->total_orders_count,
            ),
            performance_livraison: OrderRateCalculator::deliveryPerformance(
                (int) $product->delivered_count,
                (int) $product->delivery_resolved_count,
            ),
            quantite_vendue: $deliveredQuantity,
            ventes: $sales,
            cout_total_produit: $cost,
            marge_brute: $margin,
            profit_pourcentage: ProductAnalyticsCalculator::profitPercentage($margin, $sales),
            charge_totale: $chargeTotale,
            ad_spend: $adSpend,
            benefice_net: $beneficeNet,
            profit_net_pourcentage: ProductAnalyticsCalculator::profitPercentage($beneficeNet, $sales),
            moyenne_par_piece: $deliveredQuantity > 0 ? [
                'charge' => round($chargeTotale / $deliveredQuantity, 2),
                'ad_spend' => round($adSpend / $deliveredQuantity, 2),
                'benefice_net' => $beneficeNet !== null ? round($beneficeNet / $deliveredQuantity, 2) : null,
            ] : null,
        );
    }
}
