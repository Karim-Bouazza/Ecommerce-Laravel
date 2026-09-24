<?php

namespace App\Services\Charges;

use App\Enums\ChargeOrderTrigger;
use App\Enums\ChargeRecurrenceFrequency;
use App\Enums\ChargeType;
use App\Enums\OrderStatus;
use App\Models\Charge;
use App\Models\OrderItem;
use Carbon\Carbon;

class CalculateChargeAmountService
{
    public function execute(Charge $charge): int
    {
        return match ($charge->type) {
            ChargeType::Normal => (int) $charge->amount,
            ChargeType::PerOrder => $charge->amount * $this->matchingOrderItemsQuantity($charge),
            ChargeType::Recurring => $charge->amount * $this->elapsedPeriods($charge),
        };
    }

    private function matchingOrderItemsQuantity(Charge $charge): int
    {
        $status = match ($charge->order_trigger) {
            ChargeOrderTrigger::NewOrder => OrderStatus::New,
            ChargeOrderTrigger::ConfirmedOrder => OrderStatus::Confirmed,
            ChargeOrderTrigger::DeliveredOrder => OrderStatus::Delivered,
            default => null,
        };

        if ($status === null) {
            return 0;
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
            $productIds = $charge->products()->pluck('products.id');

            if ($productIds->isEmpty()) {
                return 0;
            }

            $query->whereIn('product_id', $productIds);
        }

        return (int) $query->sum('quantity');
    }

    private function elapsedPeriods(Charge $charge): int
    {
        $start = $charge->starts_at ?? $charge->created_at;

        if (! $start) {
            return 0;
        }

        $start = Carbon::parse($start)->startOfDay();
        $end = $charge->ends_at ? Carbon::parse($charge->ends_at)->endOfDay() : Carbon::now();

        if ($end->lessThan($start)) {
            return 0;
        }

        return match ($charge->recurrence_frequency) {
            ChargeRecurrenceFrequency::Daily => $start->diffInDays($end) + 1,
            ChargeRecurrenceFrequency::Weekly => intdiv($start->diffInDays($end), 7) + 1,
            ChargeRecurrenceFrequency::Monthly => $start->diffInMonths($end) + 1,
            default => 0,
        };
    }
}
