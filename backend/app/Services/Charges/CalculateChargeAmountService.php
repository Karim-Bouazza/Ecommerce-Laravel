<?php

namespace App\Services\Charges;

use App\Enums\Charge\ChargeOrderTrigger;
use App\Enums\Charge\ChargeRecurrenceFrequency;
use App\Enums\Charge\ChargeType;
use App\Enums\Order\OrderStatus;
use App\Models\Finance\Charge;
use App\Models\Finance\ChargePause;
use App\Models\Order\Order;
use App\Models\Order\OrderItem;
use App\Models\Order\OrderStatusHistory;
use App\Support\Analytics\OrderStatusGroups;
use Carbon\CarbonInterface;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Single source of truth for what a charge costs over a period.
 *
 * - One-off (normal): the full amount, counted on its start date (or creation day).
 * - Per order: the amount for each order that reached the trigger (created,
 *   confirmed, delivered), dated when it reached it, between the charge's
 *   start and end dates, outside of pauses.
 * - Recurring: the amount on each due date (start date + n days/weeks/months)
 *   that has already passed, before the end date, outside of pauses.
 */
class CalculateChargeAmountService
{
    /**
     * Amount of the charge counted as an expense in the [$from, $to] period (all time when null).
     */
    public function execute(Charge $charge, ?CarbonInterface $from = null, ?CarbonInterface $to = null): int
    {
        return match ($charge->type) {
            ChargeType::Normal => $this->normalAmount($charge, $from, $to),
            ChargeType::PerOrder => $charge->amount * $this->perOrderEvents($charge, $from, $to)->count(),
            ChargeType::Recurring => $charge->amount * $this->recurringOccurrences($charge, $from, $to),
        };
    }

    /**
     * Total owed so far, used for the payment status.
     */
    public function dueAmount(Charge $charge): int
    {
        return $charge->type === ChargeType::Normal
            ? (int) $charge->amount
            : $this->execute($charge);
    }

    /**
     * Per-order charge split by product: each order's amount is shared between
     * its concerned products in proportion to their quantity.
     *
     * @return array<int, float> product_id => amount
     */
    public function perOrderAllocation(Charge $charge, ?CarbonInterface $from = null, ?CarbonInterface $to = null): array
    {
        if ($charge->type !== ChargeType::PerOrder) {
            return [];
        }

        $productIds = $this->concernedProductIds($charge);

        if ($productIds !== null && $productIds->isEmpty()) {
            return [];
        }

        $items = OrderItem::query()
            ->joinSub($this->perOrderEvents($charge, $from, $to), 'events', 'events.order_id', '=', 'order_items.order_id')
            ->when($productIds !== null, fn ($query) => $query->whereIn('order_items.product_id', $productIds))
            ->get(['order_items.order_id', 'order_items.product_id', 'order_items.quantity']);

        $allocations = [];

        foreach ($items->groupBy('order_id') as $orderItems) {
            $orderQuantity = (float) $orderItems->sum('quantity');

            foreach ($orderItems as $item) {
                $share = $orderQuantity > 0 ? $item->quantity / $orderQuantity : 1 / $orderItems->count();
                $allocations[$item->product_id] = ($allocations[$item->product_id] ?? 0.0) + $charge->amount * $share;
            }
        }

        return $allocations;
    }

    private function normalAmount(Charge $charge, ?CarbonInterface $from, ?CarbonInterface $to): int
    {
        if (! $charge->is_active) {
            return 0;
        }

        $date = $charge->effectiveStart();

        $inPeriod = ($from === null || $date->greaterThanOrEqualTo(Carbon::parse($from)->startOfDay()))
            && ($to === null || $date->lessThanOrEqualTo(Carbon::parse($to)->endOfDay()));

        return $inPeriod ? (int) $charge->amount : 0;
    }

    /**
     * Orders that triggered the charge in the period, as (order_id, event_at) rows.
     */
    private function perOrderEvents(Charge $charge, ?CarbonInterface $from, ?CarbonInterface $to): Builder
    {
        [$start, $end] = $this->window($charge, $from, $to);

        $events = match ($charge->order_trigger) {
            ChargeOrderTrigger::NewOrder => Order::query()->select('id as order_id', 'created_at as event_at')->toBase(),
            ChargeOrderTrigger::ConfirmedOrder => $this->firstReached(OrderStatusGroups::confirmedOrLater()),
            ChargeOrderTrigger::DeliveredOrder => $this->firstReached([OrderStatus::Delivered]),
            default => $this->firstReached([]),
        };

        $query = DB::query()->fromSub($events, 'events')
            ->select('events.order_id')
            ->whereBetween('events.event_at', [$start, $end]);

        foreach ($this->pauses($charge) as $pause) {
            $query->where(fn ($q) => $q
                ->where('events.event_at', '<', $pause->paused_at)
                ->orWhere('events.event_at', '>=', $pause->resumed_at ?? now()));
        }

        $productIds = $this->concernedProductIds($charge);

        if ($productIds !== null) {
            $query->whereExists(fn ($q) => $q
                ->from('order_items')
                ->whereColumn('order_items.order_id', 'events.order_id')
                ->whereIn('order_items.product_id', $productIds));
        }

        return $query;
    }

    /**
     * When each order first reached one of the given statuses.
     *
     * @param  array<int, OrderStatus>  $statuses
     */
    private function firstReached(array $statuses): Builder
    {
        return OrderStatusHistory::query()
            ->whereIn('status', $statuses)
            ->groupBy('order_id')
            ->selectRaw('order_id, MIN(created_at) as event_at')
            ->toBase();
    }

    private function recurringOccurrences(Charge $charge, ?CarbonInterface $from, ?CarbonInterface $to): int
    {
        if ($charge->recurrence_frequency === null) {
            return 0;
        }

        [$start, $end] = $this->window($charge, $from, $to);
        $anchor = $charge->effectiveStart();
        $pauses = $this->pauses($charge);
        $count = 0;

        for ($n = 0; ; $n++) {
            $date = match ($charge->recurrence_frequency) {
                ChargeRecurrenceFrequency::Daily => $anchor->copy()->addDays($n),
                ChargeRecurrenceFrequency::Weekly => $anchor->copy()->addWeeks($n),
                ChargeRecurrenceFrequency::Monthly => $anchor->copy()->addMonthsNoOverflow($n),
            };

            if ($date->greaterThan($end)) {
                break;
            }

            if ($date->greaterThanOrEqualTo($start) && ! $this->isPaused($date, $pauses)) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Intersection of the charge's own dates with the requested period, never past now.
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    private function window(Charge $charge, ?CarbonInterface $from, ?CarbonInterface $to): array
    {
        $starts = array_filter([$charge->effectiveStart(), $from ? Carbon::parse($from)->startOfDay() : null]);
        $ends = array_filter([
            Carbon::now(),
            $charge->ends_at ? Carbon::parse($charge->ends_at)->endOfDay() : null,
            $to ? Carbon::parse($to)->endOfDay() : null,
        ]);

        return [max($starts), min($ends)];
    }

    /**
     * Periods during which the charge was disabled.
     *
     * @return Collection<int, ChargePause>
     */
    private function pauses(Charge $charge): Collection
    {
        if (! $charge->is_active && $charge->pauses->isEmpty()) {
            // Disabled without any recorded pause: treat it as paused from the start.
            return collect([new ChargePause(['paused_at' => $charge->effectiveStart(), 'resumed_at' => null])]);
        }

        return $charge->pauses;
    }

    /**
     * @param  Collection<int, ChargePause>  $pauses
     */
    private function isPaused(CarbonInterface $date, Collection $pauses): bool
    {
        return $pauses->contains(fn (ChargePause $pause) => $date->greaterThanOrEqualTo($pause->paused_at)
            && $date->lessThan($pause->resumed_at ?? now()));
    }

    /**
     * Products the charge is restricted to, or null when it concerns every product.
     *
     * @return Collection<int, int>|null
     */
    private function concernedProductIds(Charge $charge): ?Collection
    {
        return $charge->all_products ? null : $charge->products->pluck('id');
    }
}
