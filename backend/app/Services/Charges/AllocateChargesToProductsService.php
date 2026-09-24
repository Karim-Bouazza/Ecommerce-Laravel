<?php

namespace App\Services\Charges;

use App\Enums\ChargeOrderTrigger;
use App\Enums\ChargeType;
use App\Enums\OrderStatus;
use App\Models\Charge;
use App\Models\OrderItem;

class AllocateChargesToProductsService
{
    public function __construct(private readonly CalculateChargeAmountService $calculator)
    {
    }

    /**
     * @return array<int, float> product_id => allocated charge amount
     */
    public function execute(): array
    {
        $deliveredQuantityByProduct = $this->deliveredQuantityByProduct();
        $totalDeliveredQuantity = array_sum($deliveredQuantityByProduct);

        $allocations = [];

        Charge::query()
            ->with('products:id')
            ->chunk(100, function ($charges) use (&$allocations, $deliveredQuantityByProduct, $totalDeliveredQuantity) {
                foreach ($charges as $charge) {
                    $chargeAllocations = $charge->type === ChargeType::PerOrder
                        ? $this->allocatePerOrderCharge($charge)
                        : $this->allocateFlatCharge($charge, $deliveredQuantityByProduct, $totalDeliveredQuantity);

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
    private function deliveredQuantityByProduct(): array
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', OrderStatus::Delivered)
            ->groupBy('order_items.product_id')
            ->selectRaw('order_items.product_id, SUM(order_items.quantity) as qty')
            ->pluck('qty', 'product_id')
            ->map(fn ($qty) => (float) $qty)
            ->all();
    }

    /**
     * @return array<int, float>
     */
    private function allocatePerOrderCharge(Charge $charge): array
    {
        $status = match ($charge->order_trigger) {
            ChargeOrderTrigger::NewOrder => OrderStatus::New,
            ChargeOrderTrigger::ConfirmedOrder => OrderStatus::Confirmed,
            ChargeOrderTrigger::DeliveredOrder => OrderStatus::Delivered,
            default => null,
        };

        if ($status === null) {
            return [];
        }

        $query = OrderItem::query()
            ->whereHas('order', function ($query) use ($charge, $status) {
                $query->whereHas('statusHistories', fn ($q) => $q->where('status', $status));

                if ($charge->starts_at) {
                    $query->whereDate('created_at', '>=', $charge->starts_at);
                }

                if ($charge->ends_at) {
                    $query->whereDate('created_at', '<=', $charge->ends_at);
                }
            });

        if (! $charge->all_products) {
            $productIds = $charge->products->pluck('id');

            if ($productIds->isEmpty()) {
                return [];
            }

            $query->whereIn('product_id', $productIds);
        }

        return $query
            ->groupBy('product_id')
            ->selectRaw('product_id, SUM(quantity) as qty')
            ->pluck('qty', 'product_id')
            ->map(fn ($qty) => (float) $charge->amount * (float) $qty)
            ->all();
    }

    /**
     * @param  array<int, float>  $deliveredQuantityByProduct
     * @return array<int, float>
     */
    private function allocateFlatCharge(Charge $charge, array $deliveredQuantityByProduct, float $totalDeliveredQuantity): array
    {
        $amount = $this->calculator->execute($charge);

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
