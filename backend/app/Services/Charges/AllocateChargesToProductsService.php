<?php

namespace App\Services\Charges;

use App\Enums\ChargeType;
use App\Enums\OrderStatus;
use App\Models\Charge;
use App\Models\OrderItem;
use Carbon\CarbonInterface;

class AllocateChargesToProductsService
{
    public function __construct(private readonly CalculateChargeAmountService $calculator) {}

    /**
     * Charges allocated to each product, optionally restricted to the [$from, $to] period.
     *
     * @return array<int, float> product_id => allocated charge amount
     */
    public function execute(?CarbonInterface $from = null, ?CarbonInterface $to = null): array
    {
        $deliveredQuantityByProduct = $this->deliveredQuantityByProduct($from, $to);
        $totalDeliveredQuantity = array_sum($deliveredQuantityByProduct);

        $allocations = [];

        Charge::query()
            ->with(['products:id', 'pauses'])
            ->chunk(100, function ($charges) use (&$allocations, $deliveredQuantityByProduct, $totalDeliveredQuantity, $from, $to) {
                foreach ($charges as $charge) {
                    $chargeAllocations = $charge->type === ChargeType::PerOrder
                        ? $this->calculator->perOrderAllocation($charge, $from, $to)
                        : $this->allocateFlatCharge($charge, $deliveredQuantityByProduct, $totalDeliveredQuantity, $from, $to);

                    foreach ($chargeAllocations as $productId => $amount) {
                        $allocations[$productId] = ($allocations[$productId] ?? 0) + $amount;
                    }
                }
            });

        return $allocations;
    }

    /**
     * @return array<int, float>
     */
    private function deliveredQuantityByProduct(?CarbonInterface $from, ?CarbonInterface $to): array
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', OrderStatus::Delivered)
            ->when($from, fn ($query, $from) => $query->where('orders.created_at', '>=', $from->startOfDay()))
            ->when($to, fn ($query, $to) => $query->where('orders.created_at', '<=', $to->endOfDay()))
            ->groupBy('order_items.product_id')
            ->selectRaw('order_items.product_id, SUM(order_items.quantity) as qty')
            ->pluck('qty', 'product_id')
            ->map(fn ($qty) => (float) $qty)
            ->all();
    }

    /**
     * @param  array<int, float>  $deliveredQuantityByProduct
     * @return array<int, float>
     */
    private function allocateFlatCharge(Charge $charge, array $deliveredQuantityByProduct, float $totalDeliveredQuantity, ?CarbonInterface $from, ?CarbonInterface $to): array
    {
        $amount = $this->calculator->execute($charge, $from, $to);

        if ($amount === 0) {
            return [];
        }

        if ($charge->all_products) {
            $applicableIds = array_keys($deliveredQuantityByProduct);
            $denominator = $totalDeliveredQuantity;
        } else {
            $applicableIds = $charge->products->pluck('id')->all();
            $denominator = array_sum(array_intersect_key($deliveredQuantityByProduct, array_flip($applicableIds)));
        }

        if ($denominator <= 0 || empty($applicableIds)) {
            return [];
        }

        $allocations = [];

        foreach ($applicableIds as $productId) {
            $qty = $deliveredQuantityByProduct[$productId] ?? 0.0;

            if ($qty <= 0) {
                continue;
            }

            $allocations[$productId] = $amount * ($qty / $denominator);
        }

        return $allocations;
    }
}
